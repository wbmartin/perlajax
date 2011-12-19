#! /usr/bin/perl
package ResourceAction;
use CGI qw(:standard);
use JSON;
use DBI;
use strict;
Main:{
  my ($DBInfo,$dbh, $json, $json_text,$ndx );
  print header('application/json');
  $DBInfo ={dbname=>"simpledemo", user=>"simpledemo", password=>"simpledemo"};
  &UTL::dbConnect(\$dbh, $DBInfo);
my $params = {user_id =>'simpledemo', password =>'simpledemo'};

  
if(1==1){
  #my $sql =&UTL::buildSQL("security_user","authenticate");
 
  #my $sth = $dbh->prepare($sql);
  my $sth = &UTL::buildSTH($dbh,"security_user","authenticate", $params );

  $sth->execute();

# iterate through resultset
# print values
  my @rows;
  while(my $ref = $sth->fetchrow_hashref()) {
	push(@rows, $ref);
  }

#######################



####################

  $json->{"rows"} =\@rows;

  $json_text = to_json($json);
  print $json_text;
}
}#End Main
################################################################
package UTL;
sub dbConnect{
  my $dbh = shift;
  my $DBInfo = shift;
  ${$dbh} = DBI->connect(	"DBI:Pg:dbname=$DBInfo->{dbname};host=localhost",
			$DBInfo->{user}, 
			$DBInfo->{password}, 
			{'RaiseError' => 1});
return;
}
sub toCC{
  my($in) = shift;
  my($out)="";
  my(@parts) = split(/_/,$in);
  my($ndx)=0;
  $out = $parts[0];
  for( $ndx =1;$ndx<= $#parts;$ndx++){ $out .= ucfirst($parts[$ndx]); }
  return $out;
}

sub buildSQLColsList{
  my($SQLColsList);
  my $colArrayRef = shift;
  foreach(@$colArrayRef){
	$SQLColsList .= " $_,";
  }
  $SQLColsList =~ s/,$//;
  $SQLColsList .= " ";
  return $SQLColsList;('password');
}

sub buildSTH{
  my $dbh = shift;
  my $resource = shift;
  my $action = shift;
  my $params = shift;
  
  my ($sql,@spFields,$raDef, @stdFieldNames, $sth, $ndx);
    @stdFieldNames = ('client_id', 'user_id', 'session_id');
  # Load the Resource/Action Hashref and standard field names
  my $resourceActionDef =&buildResourceActionDef();
  # assign the specific resource action
  $raDef=$resourceActionDef->{uc($resource."_".$action)}; #resource action definition
  @spFields = (@stdFieldNames,@{$raDef->{tf}});
  $sql = "SELECT " . &buildSQLColsList($raDef->{rf})  ." from $raDef->{func}(" . ("?," x $#spFields) . "?);"  ;
  $sth = $dbh->prepare($sql);

  $ndx=1;
  foreach(@spFields){
	$sth->bind_param($ndx++,$params->{$_}); 
  }
  return $sth;



}
sub buildResourceActionDef{
return 
{SECURITY_USER_AUTHENTICATE=>
	{  rf=>['client_id', 'user_id', 'session_id'],
	   tf=>['password'],
	   func=>"initsession"

	}

};# end resourceActionDef

}
