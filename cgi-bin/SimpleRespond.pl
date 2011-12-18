#! /usr/bin/perl
use CGI qw(:standard);
use JSON;
  my $q = CGI->new;
print header('application/json');
#my @entries =(1,2,3);
#my $json->{"entries"} = \@entries;
my $json->{"simpleText"} ="texthere";

my $json_text = to_json($json);
print $json_text;
