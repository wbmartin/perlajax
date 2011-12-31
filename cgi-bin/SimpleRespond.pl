#! /usr/bin/perl
package ResourceAction;
use CGI qw/:standard :cgi-lib/;
use JSON;
use DBI;
use strict;
Main:{
  my ($DBInfo,$dbh, $json, $json_text,$ndx, $sth,$rowRef ,$params, $cgi, $debug, $qaMode, $prodServerPassword,@rows, $rowCount);
  $debug =1;#1 for debug mode, 0 for normal
  $qaMode=1;#1 for qa mode 0 for production
  $prodServerPassword="";#Changed on Server after publish
  $cgi = CGI->new;
  print header('application/json');
  $params = Vars;
#  $params = {user_id =>'simpledemo', password =>'simpledemo', spwfResource=>"security_user", spwfAction=>"authenticate"};
   if($debug){     
	print STDERR "Script running\n";
  	while ( my ($key, $value) = each(%{$params}) ) {
          print STDERR "$key => $value\n";
    	}
   }
  if(!$qaMode){	$DBInfo ={dbname=>"concordc_firstapp", user=>"concordc_fistapp", password=>$prodServerPassword};
  }else{ 	$DBInfo ={dbname=>"golfscore", user=>"golfscore", password=>"golfscore"}; }
  &UTL::dbConnect(\$dbh, $DBInfo);
#++++++++++++++++++++++++++++++++++Begin TESTING+++++++++++++++++++++++++
#  $params = {user_id =>'simpledemo', password =>'simpledemo', spwfResource=>"security_user", spwfAction=>"authenticate"};
#  $sth = &UTL::buildSTH($dbh,$params );
#  $sth->execute();
#$rowRef = $sth->fetchrow_hashref();
#print "session: $rowRef->{session_id} \n";
  #$params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}};
  #sth = &UTL::buildSTH($dbh,"ledger_account","select", $params );
#Select 
#  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}, where_clause=>"code_type='A'",
#		 spwfResource=>"sys_code", spwfAction=>"select"};
#  $sth = &UTL::buildSTH($dbh, $params );
#insert
#  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id},code_type=>'A', key=>'B', 
#		value=>'C', notes=>'blah',spwfResource=>"sys_code", spwfAction=>"insert" };
#  $sth = &UTL::buildSTH($dbh, $params );
#update
#  $sth->execute();
 # my $rowRef2 = $sth->fetchrow_hashref();
#  $rowRef2->{notes}='got it';
#  $params = {client_id=>1,user_id =>'simpledemo', session_id =>$rowRef->{session_id}, %$rowRef2, spwfResource=>"sys_code", spwfAction=>"update" };
#  $sth = &UTL::buildSTH($dbh, $params );

#++++++++++++++++++++++++++++++++++END TESTING+++++++++++++++++++++++++
  $sth = &UTL::buildSTH($dbh, $params );

   if(ref($sth))  {
	print STDERR "Connection Successful\n" if($debug);
     $sth->execute();
	if(!$sth->err){
	  # iterate through resultset
	  $rowCount=0;
  	  while(my $ref = $sth->fetchrow_hashref()) {
	    push(@rows, $ref);
	    $rowCount++;
  	  }
	  #package it up in and print it
  	  $json->{"rows"} =\@rows;
	  $json->{"rowCount"}=$rowCount;
	}else{
	   $json->{"rowCount"}=0;
	   $json->{"errorMsg"} =$DBI::errstr;
 

	}
	print STDERR "Package Successful\n" if($debug);
    }else{
	$json->{"errorMsg"} =$sth;

    }  
  	$json_text = to_json($json);
  	print $json_text;
	print STDERR "JSON Txt: $json_text\n"  if($debug);

$dbh->disconnect()
}#End Main
################################################################
package UTL;
my $debug=0;
sub dbConnect{
  my ($dbh ,$DBInfo) = @_;
  ${$dbh} = DBI->connect("DBI:Pg:dbname=$DBInfo->{dbname};host=localhost",
			$DBInfo->{user}, 
			$DBInfo->{password}, 
			{RaiseError => 0});
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
  my ($dbh , $params) = @_;
  my ($sql,@spFields,$raDef, @stdFieldNames, $sth, $ndx);
  @stdFieldNames = ( 'user_id', 'session_id');
  # Load the Resource/Action Hashref and standard field names
  $raDef=&buildResourceActionDef($params->{spwfResource}, $params->{spwfAction});
  if(!$raDef){ return "ResourceAction Not Defined:" .$params->{spwfResource} . "-". $params->{spwfAction} ;}
  @spFields = (@stdFieldNames,@{$raDef->{pf}});
  $sql = "SELECT " . &buildSQLColsList($raDef->{rf})  ." from $raDef->{proc}('CHECK_AUTH'," . ("?," x $#spFields) . "?);"  ;
  $sth = $dbh->prepare($sql);
  $ndx=1;
  foreach(@spFields){
	print "$ndx $_ $params->{$_}\n " if $debug;
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
		$rad ={  rf=>[ 'user_id', 'session_id'], pf=>['password'], proc=>"initsession" };
	}
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  } elsif($resource eq "LEDGER_ACCOUNT" ){
	@paramFields = @allFields =( 'ledger_account_id', 'last_update', 'name', 'account_type', 
					'ledger_commodity_id', 'parent_account_id', 'code', 'description') ;
	if($action eq "SELECT"){
		$rad= { rf=>\@allFields, pf=>\@stdSelectParamFields, proc=>"ledger_account_sq" };
	}
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  } elsif($resource eq "SYS_CODE" ){
	@paramFields = @allFields = ('sys_code_id', 'code_type', 'key', 'value', 'last_update', 'notes');
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
} elsif($resource eq "GOLF_SCORE_SUMMARY" ){
	 @allFields = ('golfer_id', 'golfer_name', 'golf_score', 'last_date', 'first_date' );
	@paramFields =();
	if($action eq "SELECT"){
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golfer_handicap_sq"};
	}#elsif($action eq "INSERT"){
	#	splice @paramFields,5,1; #remove last_update
	#	splice @paramFields,0,2; #remove client_id, prkey
	#  	$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"sys_code_iq" };
	#}elsif($action eq "UPDATE"){
	#	splice @paramFields,0,1; #remove client_id, prkey 
	#	$rad= { rf=>\@allFields, pf=>\@paramFields, proc=>"sys_code_uq" };
  	#}elsif($action eq "DELETE"){
	#	$rad =   { rf=>[], pf=>['sys_code_id','last_update'], proc=>"sys_code_dq" };
	#}
} elsif($resource eq "CROSS_TABLE_CACHE" ){
	 @allFields = ('tp', 'lbl', 'val' );
	@paramFields =();
	if($action eq "SELECT"){
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"cross_table_cache_sq"};
	}



  } else {return;}
  return $rad;
}

