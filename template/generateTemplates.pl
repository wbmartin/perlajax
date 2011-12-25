#!/usr/bin/perl
use strict;
use Template;
use DBGen_Util;

use DBI;

Main:{
  my ($dbh, $key, $value, @templates,$templateName, $path, $outputPath, $tt, $var, %props, $key, $value);
  my %tables = ();
  $path = "./_templates_/";
  
  
  
  &DBGenUTIL::getProps(\%props, ($path."include.properties"));
  $outputPath = $props{outputPath};
`rm -rf $outputPath`;
  &DBGenUTIL::getConnection(\$dbh,'golfscore','golfscore');
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
	print "\nBegin template: $templateName ";
	$tt = Template->new(RELATIVE=>1, OUTPUT_PATH=>$outputPath, INCLUDE_PATH=>'./_templates_/');
	$tt->process(($path . $_),$var ) || die $tt->error(); 
	print "End template $templateName";
     
  }
print "\n\n";
   $dbh->disconnect();
 #print "\nxxxclient.client_id name : $tables{'client'}->{'columns'}->{'client_id'}->{'column_name'}\n";


}


