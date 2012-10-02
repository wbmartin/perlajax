#!/usr/bin/perl
use strict;
use Template;
use FindBin;
use  lib "$FindBin::Bin/";
use DBGen_Util;
use DBI;



Main:{
  my ($dbh, $key, $value, @templates,$templateName, $path, $outputPath, $tt, $var, %props, $key, $value);
  my %tables = ();
  $path = "./_templates_/";
  
  &DBGenUTIL::getProps(\%props, ("include.properties"));
  $outputPath = $props{absoluteSrcPath} ."/". $props{outputPath};
  `rm -rf $outputPath/*`;
  &DBGenUTIL::getConnection(\$dbh,'concordc_golfscoredev','concordc_golfscoredev','golfscore');
  &DBGenUTIL::getTables($dbh,\%tables);
  $var = {tbl=>\%tables,props=>\%props, toCC=>\&DBGenUTIL::toCC, ucfirst =>\&DBGenUTIL::ucf, lcfirst =>\&DBGenUTIL::lcf };
  &DBGenUTIL::grabTemplates($path, \@templates);
  print "\nif you're missing a table, be sure you've granted security.\n";
  print "\nTables: ";
  while(($key,$value) = each %tables){
	  print "$key "
  }
  foreach(@templates){
    next if /swp/;
     $templateName = $_;
	  print "\nBegin template: $templateName | ";
	  $tt = Template->new(RELATIVE=>1, OUTPUT_PATH=>$outputPath, INCLUDE_PATH=>'./_templates_/');
	  $tt->process(($path . $templateName),$var ) || die $tt->error(); 
	  print "End template $templateName\n";
  }
	$tt = Template->new(RELATIVE=>1, OUTPUT_PATH=>$outputPath, INCLUDE_PATH=>'./_templates_/mobile/');
	$tt->process(($path . "mobile/MOBILEMain.tt"),$var ) || die $tt->error();
  $dbh->disconnect();
`cp $outputPath/index.html $props{absoluteSrcPath}`;
  print "\n\n";


}


