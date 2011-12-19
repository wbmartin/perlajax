#!/usr/bin/perl
package DBGenSCHEMA;
    use strict;
    use warnings;
    use Template;
    use DBGen_Util;


 sub processSchema{
  my($tables_) = shift;
  my( $key, $path, $value);
my ($tt,@templates,$vars, $templateName,$table, $outputPath );

  $path = "./_templates_/";
  $outputPath = "./gen";
  `rm -rf $outputPath`;
  &DBGenUTIL::grabTemplates($path, \@templates);
    foreach(@templates){
     $templateName = $_;
    # foreach $table (keys %$tables_ ){
        $tt = Template->new(RELATIVE=>1, OUTPUT_PATH=>$outputPath);
        
	print "\nBegin template: $templateName | $table | $tables_->{$table}->{type}\n";
	$tt->process(($path . $_), $tables_) || die $tt->error(); 
	print "End template $templateName\n";
   #  }
  }


}

return 1;

