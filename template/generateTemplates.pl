#!/usr/bin/perl
use strict;
use Template;
use FindBin;
use  lib "$FindBin::Bin/";
use DBGen_Util;
use DBI;
my $webTemplatePath='/home/wbmartin/www/firstapp/template/_templates_/app';

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
my @appTemplates ;
&populateWebTemplates(\@appTemplates);
	$var = {tbl=>\%tables,props=>\%props, toCC=>\&DBGenUTIL::toCC, ucfirst =>\&DBGenUTIL::ucf, lcfirst =>\&DBGenUTIL::lcf, appTemplates=>\@appTemplates };
	&DBGenUTIL::grabTemplates($templatePath, \@templates);
print "\nif you're missing a table, be sure you've granted security.\n";
print "\nTables: ";
while(($key,$value) = each %tables){
	print "$key "
}
print "\n";
foreach(@templates){
	next if /swp/;
	$templateName = $_;
	print "Begin template: $templateName | ";
	$tt = Template->new(RELATIVE=>1,ABSOLUTE=>1, OUTPUT_PATH=>$outputPath, INCLUDE_PATH=>"$templatePath");
	$tt->process(("${templatePath}$templateName"),$var ) || die $tt->error(); 
	print "End template $templateName\n";
}
$dbh->disconnect();

#Post Processing
print "replacing Tabs\n";
`perl -p -i -e 's/\t/  /g' $outputPath/app.js`;
`perl -p -i -e 's/\t/  /g' $outputPath/appmobile.js`;
print "replacing EOL whitespace\n";
`perl -p -i -e 's/[ \t]+\$//g' $outputPath/app.js`;
`perl -p -i -e 's/[ \t]+\$//g' $outputPath/appmobile.js`;
#print "adjusting mobile path";
#`perl -p -i -e 's/images\//\.\.images\//g' $outputPath/mobile.html`;
#print `gjslint $outputPath/app.js`;

#File Copies
`cp $outputPath/index.html $absoluteSrcPath/deploy/`; # copy the generated index.html
`cp $outputPath/app.js $absoluteSrcPath/deploy/`; # copy the generated app.js
`cp $outputPath/mobile.html $absoluteSrcPath/deploy/mobile/index.html`; # copy the generated mobile
`cp $outputPath/appmobile.js $absoluteSrcPath/deploy/mobile/`; # copy the generated mobile
#print "\n\n";


}

sub populateWebTemplates{
	my ($pathArray) = pop;
	my($dh1, $dh2,$folder, $file);
	opendir $dh1, $webTemplatePath;
	while($folder = readdir $dh1){
			next if ($folder =~ m/^\./);
		opendir $dh2, "$webTemplatePath/$folder";
		while($file = readdir $dh2){
			next if ($file =~ m/^\./);
			push(@$pathArray, ("${webTemplatePath}/${folder}/${file}"));
		}
		closedir $dh2;
	}
	closedir $dh1;
}

