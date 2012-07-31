#! /usr/bin/perl
package ResourceAction;
use CGI qw/:standard :cgi-lib/;
use JSON;
use DBI;
use strict;
Main:{
  my ($DBInfo,$dbh, $json, $json_text,$ndx, $sth,$rowRef ,$params, $cgi, $debug, $codeEnv, $prodServerPassword,@rows, $rowCount);
  my($keywords, @passThrus, $key,$value, $uatServerPassword);
  $debug =1;#1 for debug mode, 0 for normal
  $codeEnv="DEV";#1 for qa mode 0 for production
  $prodServerPassword="";#Changed on Server after publish
  $uatServerPassword="";#Changed on Server after publish
  $cgi = CGI->new;
  print header('application/json');
  $params = Vars;# export form valuesensures that you also get multi-value <select>s as separate values. too.

  if (exists $params->{"POSTDATA"}){#Post data is wrapped in POSTDATA, so extract up to params level and remove the original.
    $keywords = from_json($params->{"POSTDATA"});
    %{$params} = (%{$params}, %{$keywords});
    delete $params->{"POSTDATA"};
  }
  if($debug){ #print some debugging info    
	print STDERR "Script running - Parameters received:\n";
  	while ( my ($key, $value) = each(%{$params}) ) {
          print STDERR "\t$key => $value\n";
    	}
  }
  if($codeEnv eq "PROD"){# set the evironment specific connection data
	$DBInfo ={dbname=>"concordc_golfscore", user=>"concordc_golfscore", password=>$prodServerPassword};
  }elsif($codeEnv eq "UAT"){
	$DBInfo ={dbname=>"concordc_golfscoreuat", user=>"concordc_golfscoreuat", password=>$uatServerPassword};
  }else{
 	$DBInfo ={dbname=>"concordc_golfscoredev", user=>"concordc_golfscoredev", password=>"golfscore"}; 
  }

  &UTL::dbConnect(\$dbh, $DBInfo);
  $sth = &UTL::buildSTH($dbh, $params );

   if(ref($sth))  {#if we have a successful connection and statement built, execute it, iterate over result set, package and return
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
	if (uc($params->{'spwfAction'}) eq "DELETE"){
  	  while ( my ($key, $value) = each(%$params) ) {
	    if($key ne 'last_update' && $key ne 'user_id' && $key ne 'session_id'){
        	$json->{$key} = $value;
	    }
    	  }
	}
	#tag on the original action and resource form the request
	$json->{"spwfAction"}= uc($params->{'spwfAction'});
	$json->{"spwfResource"}= uc($params->{'spwfResource'});
	$json->{"requestId"}=$params->{'requestId'};
	#any variables the client sent that they wanted returned to the asynch success function
        if(exists $params->{'passThru'}){
	  @passThrus = split(/;/,$params->{'passThru'});
	  foreach(@passThrus){
	    ($key,$value) = split(/~/,$_);
	    $key ="PT_$key";
	    $json->{$key} = $value;	
	  }
	}
	print STDERR "Package Successful\n" if($debug);
    }else{#if no successful connection or statement build issue, package the error
	$json->{"errorMsg"} =$sth;
    }  
	$json_text = to_json($json);
  	print $json_text;
	print STDERR "JSON Txt: $json_text\n"  if($debug);
$dbh->disconnect()
}#End Main
################################################################
package UTL;
use strict;
my $debug=1;
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

sub removeArrayElement(){
  my $arrayRef = shift;
  my $elementToRemove = shift;
  my $ndx=0;
  for( $ndx =0; $ndx <@$arrayRef; $ndx++){
   if (${$arrayRef}[$ndx] eq $elementToRemove){
    splice(@{$arrayRef}, $ndx, 1);
     last;
   }
  }
   return;
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
$debug=1;
  # Load the Resource/Action Hashref and standard field names
  $raDef=&buildResourceActionDef($params->{spwfResource}, $params->{spwfAction});
  if(!$raDef){ return "ResourceAction Not Defined:" .$params->{spwfResource} . "-". $params->{spwfAction}. "." ;}
  @spFields = (@stdFieldNames,@{$raDef->{pf}});
  $sql = "SELECT " . &buildSQLColsList($raDef->{rf})  ." from $raDef->{proc}('CHECK_AUTH'," . ("?," x $#spFields) . "?) ;" ;
  print STDERR "SQL: $sql\n" if($debug);
  $sth = $dbh->prepare($sql);
  $ndx=1;
  foreach(@spFields){
	print STDERR "\tBinding Params $ndx $_ $params->{$_}\n " if ($debug);
	$sth->bind_param($ndx++,$params->{$_});
  }
  return $sth;
}

sub buildResourceActionDef{
  my $resource =uc(shift);
  my $action = uc(shift);
  my ($rad, @stdSelectParamFields,@allFields,@paramFields);
  @stdSelectParamFields= ('where_clause','orderby_clause', 'rowlimit','startrow');
  print STDERR "searching for $resource $action\n" if($debug);
  if ($resource eq "SECURITY_USER" ){
	@allFields = ('security_user_id', 'user_id','password_enc', 'last_update', 'security_profile_id', 'session_id', 'session_expire_dt' , 'active_yn');
	if($action eq "AUTHENTICATE") {
		$rad ={  rf=>[ 'user_id', 'session_id'], pf=>['password'], proc=>"initsession" };
	} elsif($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'last_update');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		&removeArrayElement(\@paramFields, 'password_enc');
		&removeArrayElement(\@paramFields, 'session_id');
		&removeArrayElement(\@paramFields, 'session_expire_dt');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('security_user_id','last_update');
		$rad = { rf=>['security_user_dq'], pf=>\@paramFields, proc=>"security_user_dq"};
	}elsif($action eq "DELETEW"){
		@paramFields=('where_clause');
		$rad = { rf=>['security_user_dqw'], pf=>\@paramFields, proc=>"security_user_dqw"};
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
		&removeArrayElement(\@paramFields, 'last_update');
		&removeArrayElement(\@paramFields, 'sys_code_id');
	  	$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"sys_code_iq" };
	}elsif($action eq "UPDATE"){
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
	}
} elsif($resource eq "CROSS_TABLE_CACHE" ){
	 @allFields = ('tp', 'lbl', 'val' );
	@paramFields =();
	if($action eq "SELECT"){
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"cross_table_cache_sq"};
	}
} elsif($resource eq "GOLF_SCORE" ){
	 @allFields = ('golf_score_id', 'last_update', 'golf_score', 'golfer_id','game_dt' );
	if($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'golf_score_id');
		&removeArrayElement(\@paramFields, 'last_update');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golf_score_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golf_score_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golf_score_uq"};
	}elsif($action eq "DELETE"){
		@paramFields = ('golf_score_id', 'last_update');
		$rad = { rf=>['golf_score_dq'], pf=>\@paramFields, proc=>"golf_score_dq"};
	}
} elsif($resource eq "GOLFER" ){
	 @allFields = ('golfer_id', 'last_update', 'name');
	if($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'golfer_id');
		&removeArrayElement(\@paramFields, 'last_update');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golfer_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golfer_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"golfer_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('golfer_id','last_update');
		$rad = { rf=>['golfer_dq'], pf=>\@paramFields, proc=>"golfer_dq"};
	}
} elsif($resource eq "SECURITY_PROFILE" ){
	 @allFields = ('security_profile_id', 'profile_name', 'last_update' );
	if($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'security_profile_id');
		&removeArrayElement(\@paramFields, 'last_update');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('security_profile_id','last_update');
		$rad = { rf=>['security_profile_dq'], pf=>\@paramFields, proc=>"security_profile_dq"};
	}
} elsif($resource eq "SECURITY_PRIVILEGE" ){
	 @allFields = ('security_privilege_id', 'priv_name','description', 'last_update' );
	if($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'security_privilege_id');
		&removeArrayElement(\@paramFields, 'last_update');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_privilege_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_privilege_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_privilege_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('security_privilege_id','last_update');
		$rad = { rf=>['security_privilege_dq'], pf=>\@paramFields, proc=>"security_privilege_dq"};
	}
} elsif($resource eq "SECURITY_PROFILE_GRANT" ){
	 @allFields = ('security_privilege_id', 'security_profile_id', 'last_update' );
	if($action eq "INSERT"){
		@paramFields =@allFields;
		&removeArrayElement(\@paramFields, 'last_update');
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_grant_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_grant_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=@allFields;
		  $rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_profile_grant_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('security_profile_grant_id','last_update');
		$rad = { rf=>['security_profile_grant_dq'], pf=>\@paramFields, proc=>"security_profile_grant_dq"};
	}elsif($action eq "DELETEW"){
		@paramFields=('where_clause');
		$rad = { rf=>['security_profile_grant_dqw'], pf=>\@paramFields, proc=>"security_profile_grant_dqw"};
	}


} else {print STDERR "Not Found: $resource $action" if $debug; return;}
  return $rad;
}


