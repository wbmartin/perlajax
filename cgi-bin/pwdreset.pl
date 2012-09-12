#!/usr/bin/perl
 use strict;
 use warnings;
 use MIME::Lite::TT::HTML;
 use UTL; 
 use CGI qw/:standard :cgi-lib/;
 use JSON;

 Main:{
 my (%params, $dbh, $fromAddr,$toAddr, $subject, $sendmailPath, $options, $template, $cgi, $params, $sth);
my( $emailParams, @rows, $json, $json_text, $rowCount);
 $sendmailPath = "/usr/lib/sendmail" ;
 $fromAddr = 'passwordreset@martinanalytics.com';
 
 $options->{INCLUDE_PATH} = 'mailtt/';

 $cgi = CGI->new;
  print header('application/json');
	$params = Vars;
  $params = &UTL::parseParams($params);# export form values ensures that you also get multi-value <select>s as separate values. too.
 &UTL::dbConnect(\$dbh);
	print STDERR "$params->{'user_id'}";
	if($params->{'user_id'}){
  	$sth= $dbh->prepare("select  pwd_reset_cd, email_addr from init_passwd_reset('',?) ;");
		$sth->bind_param(1,$params->{"user_id"});
  }elsif($params->{'email_addr'}){
		$sth= $dbh->prepare("select user_id, email_addr, pwd_reset_cd from init_lostuname('',?);");
		$sth->bind_param(1,$params->{"email_addr"});
	}
	$sth->execute();
	if(!$sth->err){
	  			$rowCount=0;# iterate through resultset
  	  		while(my $ref = $sth->fetchrow_hashref()) {
	    			push(@rows, $ref);
	    			$rowCount++;
  	  		}
	}

if($params->{'user_id'}){
  $emailParams->{'password_reset_code'} = $rows[0]->{'pwd_reset_cd'};
	$template = { text =>'forgottenPassword.txt.tt', html => 'forgottenPassword.html.tt' };
	$subject = 'Forgotten Password';
	$toAddr = $rows[0]->{'email_addr'};
}elsif($params->{'email_addr'}){
  $emailParams->{'password_reset_code'} = $rows[0]->{'pwd_reset_cd'};
  $emailParams->{'user_id'} = $rows[0]->{'user_id'};
  $template = { text =>'forgottenUname.txt.tt', html => 'forgottenUname.html.tt' };
	$subject ="Forgotten User Name";
	$toAddr = $rows[0]->{'email_addr'};
}

 my $msg = MIME::Lite::TT::HTML->new(From =>$fromAddr, To=>$toAddr, Subject=>$subject,
            Template =>$template, TmplOptions=>$options, TmplParams=>$emailParams);

 $msg->send("sendmail","$sendmailPath -t -oi -f$fromAddr");
 $json->{'success'}="true";
 	$json_text = to_json($json);
  	print $json_text;

 }
