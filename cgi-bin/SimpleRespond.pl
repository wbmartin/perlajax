#! /usr/bin/perl
package ResourceAction;
use CGI qw(:standard);
use JSON;
use DBI;
use strict;
Main:{
  my ($DBInfo,$dbh, $json, $json_text,$ndx, $sth,$rowRef );
  print header('application/json');
  $DBInfo ={dbname=>"simpledemo", user=>"simpledemo", password=>"simpledemo"};
  &UTL::dbConnect(\$dbh, $DBInfo);
my $params;
  $params = {user_id =>'simpledemo', password =>'simpledemo'};
  $sth = &UTL::buildSTH($dbh,"security_user","authenticate", $params );
  $sth->execute();
$rowRef = $sth->fetchrow_hashref();
print "session: $rowRef->{session_id} \n";
  #$params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}};
  #$sth = &UTL::buildSTH($dbh,"ledger_account","select", $params );
 
  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}};
   $sth = &UTL::buildSTH($dbh,"sys_code","select", $params );
   if(ref($sth))  {
     $sth->execute();
	# iterate through resultset
  	my @rows;
  	while(my $ref = $sth->fetchrow_hashref()) {
	  push(@rows, $ref);
  	}
	#package it up in and print it
  	$json->{"rows"} =\@rows;
    }else{
	$json->{"errorMsg"} =$sth;

    }  
  	$json_text = to_json($json);
  	print $json_text;

$dbh->disconnect()
}#End Main
################################################################
package UTL;
sub dbConnect{
  my $dbh = shift;
  my $DBInfo = shift;
  ${$dbh} = DBI->connect("DBI:Pg:dbname=$DBInfo->{dbname};host=localhost",
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
  $raDef=$resourceActionDef->{uc($resource)}->{uc($action)}; #resource action definition
  #if(! exists $resourceActionDef->{uc($resource)}->{uc($action)} ){ return "ResourceAction Not Defined";}
  if(!$raDef){ return "ResourceAction Not Defined";}

    @spFields = (@stdFieldNames,@{$raDef->{pf}});
    $sql = "SELECT " . &buildSQLColsList($raDef->{rf})  ." from $raDef->{proc}('CHECK_AUTH'," . ("?," x $#spFields) . "?);"  ;
    $sth = $dbh->prepare($sql);
    $ndx=1;
    foreach(@spFields){
	print "$ndx $_ $params->{$_}\n ";
	$sth->bind_param($ndx++,$params->{$_});
    }
  return $sth;

}
sub buildResourceActionDef{
my $rad;
my @stdSelectParamFields = ('where_clause','orderby_clause', 'rowlimit','startrow');
$rad->{SECURITY_USER}={
  AUTHENTICATE=>{  
	rf=>['client_id', 'user_id', 'session_id'],
	pf=>['password'],
	proc=>"initsession"
  }
};

my @ledgerAccountAllFields =('client_id', 'ledger_account_id', 'last_update', 'name', 'account_type', 'ledger_commodity_id', 'parent_account_id', 'code', 'description') ;
$rad->{LEDGER_ACCOUNT} ={
  SELECT =>{
	rf=>\@ledgerAccountAllFields,
	pf=>\@stdSelectParamFields,
	proc=>"ledger_account_sq"
  }
};

my @sysCodeAllFields = ('sys_code_id', 'code_type', 'key', 'value', 'last_update', 'notes');
$rad->{SYS_CODE} ={
  SELECT =>{
	rf=>\@sysCodeAllFields ,
	pf=>\@stdSelectParamFields,
	proc=>"sys_code_sq"
  },
  INSERT =>{
	rf=>\@sysCodeAllFields,
	pf=>['where_clause','orderby_clause', 'rowlimit','startrow'],
	proc=>"sys_code_sq"
  }
};





return $rad
}# end resourceActionDef

