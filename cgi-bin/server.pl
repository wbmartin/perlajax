#! /usr/bin/perl
package SERVER;
use CGI qw/:standard :cgi-lib/;
use JSON;
use DBI;
use UTL;
use strict;

my $debug=1;

Main:{
  my ($dbh, $json, $json_text,$ndx, $sth,$rowRef ,$params, $cgi,  @rows, $rowCount);
  my ($keywords, @passThrus, $key,$value );
  $cgi = CGI->new;
  print header('application/json');
	$params = Vars;
  $params = &UTL::parseParams($params);# export form values ensures that you also get multi-value <select>s as separate values. too.
  &UTL::dbConnect(\$dbh );
  $sth = &buildSTH($dbh, $params );

  if(ref($sth))  {#if we have a successful connection and statement built, execute it, iterate over result set, package and return
				print STDERR "Connection Successful\n" if($debug);
        $sth->execute();
				if(!$sth->err){
	  			$rowCount=0;# iterate through resultset
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
				print STDERR "Pagination: " . $params->{'spwfPagination'};
				if (uc($params->{'spwfAction'}) eq "SELECT" && uc($params->{'spwfPagination'}) eq "TRUE"){
					$json->{"spwfTotalItemCount"} = 20;
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
sub buildSTH{
  my ($dbh , $params) = @_;
  my ($sql,@spFields,$raDef, @stdFieldNames, $sth, $ndx);
  @stdFieldNames = ( 'user_id', 'session_id');
  # Load the Resource/Action Hashref and standard field names
  $raDef=&buildResourceActionDef($params->{spwfResource}, $params->{spwfAction});
  if(!$raDef){ return "ResourceAction Not Defined:" .$params->{spwfResource} . "-". $params->{spwfAction}. "." ;}
  @spFields = (@stdFieldNames,@{$raDef->{pf}});
  $sql = "SELECT " . &UTL::buildSQLColsList($raDef->{rf})  ." from $raDef->{proc}('CHECK_AUTH'," . ("?," x $#spFields) . "?) ;" ;
  print STDERR "SQL: $sql\n" if($debug);
  $sth = $dbh->prepare($sql);
  $ndx=1;
  foreach(@spFields){
	print STDERR "\tBinding Params $ndx $_ $params->{$_}\n " if ($debug && $_ ne "password");
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
	@allFields = ('security_user_id', 'user_id','password_enc', 'last_update', 'security_profile_id', 'session_id', 'session_expire_dt' , 'active_yn', 'email_addr');
	if($action eq "AUTHENTICATE") {
		$rad ={  rf=>[ 'user_id', 'session_id'], pf=>['password'], proc=>"initsession" };
	} elsif($action eq "INSERT"){
		@paramFields =( 'edit_user_id','password_enc', 'security_profile_id',  'active_yn', 'email_addr');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_iq"};
	}elsif($action eq "SELECT"){
		@paramFields=@stdSelectParamFields;
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_sq"};
	}elsif($action eq "UPDATE"){
		@paramFields=('security_user_id', 'edit_user_id', 'last_update', 'security_profile_id',   'active_yn', 'email_addr');
		$rad = { rf=>\@allFields, pf=>\@paramFields, proc=>"security_user_uq"};
	}elsif($action eq "DELETE"){
		@paramFields=('security_user_id','last_update');
		$rad = { rf=>['security_user_dq'], pf=>\@paramFields, proc=>"security_user_dq"};
	}elsif($action eq "DELETEW"){
		@paramFields=('where_clause');
		$rad = { rf=>['security_user_dqw'], pf=>\@paramFields, proc=>"security_user_dqw"};
	}elsif($action eq "ONE_TIME"){
		@paramFields=('password_reset_code');
		$rad = { rf=>['user_id','session_id'], pf=>\@paramFields, proc=>"initsession_onetime"};
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
} elsif($resource eq "SECURITY_CHANGE_PASSWORD" ){
	 @allFields = ('user_to_update', 'new_pasword'  );
	if($action eq "CHANGE"){
		@paramFields =@allFields;
		  $rad = { rf=>['change_password'], pf=>\@paramFields, proc=>"change_password"};
	}


} else {print STDERR "Not Found: $resource $action" if $debug; return;}
  return $rad;
}


