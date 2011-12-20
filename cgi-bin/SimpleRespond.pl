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
#++++++++++++++++++++++++++++++++++Begin TESTING+++++++++++++++++++++++++
my $params;
  $params = {user_id =>'simpledemo', password =>'simpledemo'};
  $sth = &UTL::buildSTH($dbh,"security_user","authenticate", $params );
  $sth->execute();
$rowRef = $sth->fetchrow_hashref();
#print "session: $rowRef->{session_id} \n";
  #$params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}};
  #sth = &UTL::buildSTH($dbh,"ledger_account","select", $params );
#Select 
  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}, where_clause=>"code_type='A'"};
  $sth = &UTL::buildSTH($dbh,"sys_code","select", $params );
#insert
  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id},code_type=>'A', key=>'B', value=>'C', notes=>'blah' };
  $sth = &UTL::buildSTH($dbh,"sys_code","insert", $params );
#update
  $sth->execute();
  my $rowRef2 = $sth->fetchrow_hashref();
  $rowRef2->{notes}='got it';
  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}, %$rowRef2};
  $sth = &UTL::buildSTH($dbh,"sys_code","update", $params );

#++++++++++++++++++++++++++++++++++END TESTING+++++++++++++++++++++++++

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
  my ($dbh ,$DBInfo) = @_;
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
  my $colArrayRef = shift;
  my($SQLColsList);
  foreach(@$colArrayRef){
	$SQLColsList .= " $_,";
  }
  $SQLColsList =~ s/,$/ /;
  return $SQLColsList;
}

sub buildSTH{
  my ($dbh ,$resource,$action, $params) = @_;
  my ($sql,@spFields,$raDef, @stdFieldNames, $sth, $ndx);
  @stdFieldNames = ('client_id', 'user_id', 'session_id');
  # Load the Resource/Action Hashref and standard field names
  $raDef=&buildResourceActionDef($resource,$action);
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
  my $resource =uc(shift);
  my $action = uc(shift);
  my ($rad, @stdSelectParamFields,@allFields,@paramFields);
  @stdSelectParamFields= ('where_clause','orderby_clause', 'rowlimit','startrow');
  if ($resource eq "SECURITY_USER" ){
	if($action eq "AUTHENTICATE") {
		$rad ={  rf=>['client_id', 'user_id', 'session_id'], pf=>['password'], proc=>"initsession" };
	}
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  } elsif($resource eq "LEDGER_ACCOUNT" ){
	@paramFields = @allFields =('client_id', 'ledger_account_id', 'last_update', 'name', 'account_type', 
					'ledger_commodity_id', 'parent_account_id', 'code', 'description') ;
	if($action eq "SELECT"){
		$rad= { rf=>\@allFields, pf=>\@stdSelectParamFields, proc=>"ledger_account_sq" };
	}
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  } elsif($resource eq "SYS_CODE" ){
	@paramFields = @allFields = ('client_id','sys_code_id', 'code_type', 'key', 'value', 'last_update', 'notes');
	if($action eq "SELECT"){
		  $rad = { rf=>\@allFields, pf=>\@stdSelectParamFields, proc=>"sys_code_sq"};
	}elsif($action eq "INSERT"){
		splice @paramFields,5,1; #remove last_update
		splice @paramFields,0,2; #remove client_id, prkey
	  	$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"sys_code_iq" };
	}elsif($action eq "UPDATE"){
		splice @paramFields,0,1; #remove client_id, prkey 
		$rad= { rf=>\@allFields, pf=>\@paramFields, proc=>"sys_code_uq" };
  	}elsif($action eq "DELETE"){
		$rad =   { rf=>[], pf=>['sys_code_id','last_update'], proc=>"sys_code_dq" };
	}
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  } else {return;}
  return $rad;
}

