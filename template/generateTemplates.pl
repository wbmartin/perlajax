#!/usr/bin/perl
use strict;
use Template;
use FindBin;
use  lib "$FindBin::Bin/";
use DBGen_Util;
use DBI;



Main:{
  my ($dbh, $key, $value, @templates,$templateName,  $outputPath, $tt, $var, %props, $key, $value,$templatePath,$absoluteSrcPath);
  my %tables = ();
	$absoluteSrcPath = "$FindBin::Bin/../";
	print "$absoluteSrcPath\n";
  &DBGenUTIL::getProps(\%props, ("$FindBin::Bin/include.properties"));
  $outputPath = "$absoluteSrcPath/template/_gen_";
	$templatePath = "$absoluteSrcPath/template/_templates_/";
  `rm -rf $outputPath/*`;
  &DBGenUTIL::getConnection(\$dbh,'concordc_golfscoredev','concordc_golfscoredev','golfscore');
  &DBGenUTIL::getTables($dbh,\%tables);
  $var = {tbl=>\%tables,props=>\%props, toCC=>\&DBGenUTIL::toCC, ucfirst =>\&DBGenUTIL::ucf, lcfirst =>\&DBGenUTIL::lcf };
  &DBGenUTIL::grabTemplates($templatePath, \@templates);
  print "\nif you're missing a table, be sure you've granted security.\n";
  print "\nTables: ";
  while(($key,$value) = each %tables){
	  print "$key "
  }
  foreach(@templates){
    next if /swp/;
     $templateName = $_;
	  print "\nBegin template: $templateName | ";
	  $tt = Template->new(RELATIVE=>1,ABSOLUTE=>1, OUTPUT_PATH=>$outputPath, INCLUDE_PATH=>"$templatePath");
	  $tt->process(("${templatePath}$templateName"),$var ) || die $tt->error(); 
	  print "End template $templateName";
  }
  $dbh->disconnect();
  `cp $outputPath/index.html $absoluteSrcPath/deploy/`; # copy the generated index.html
  `cp $outputPath/mobile.html $absoluteSrcPath/deploy/mobile/index.html`; # copy the generated mobile
	#print "\n\n";


}


