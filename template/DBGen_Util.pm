#! /usr/bin/perl
package DBGenUTIL;
use strict;
sub getConnection{
my($dbh_, $username_, $password_) = @_; 
  ${$dbh_} = DBI->connect('DBI:Pg:dbname=simpledemo;host=127.0.0.1',$username_, $password_);
  if (${$dbh_}) {
   print "DB Connected Successfully\n";

   } else {
   die "Cannot connect to Postgres server: $DBI::errstr\n";
  }
return;
}


sub grabTemplates{
  my ($path, $templates) = @_;
  opendir (DIR, $path) or die "$!";
   @{$templates} = grep {/tt/} readdir DIR;
  close DIR;
return;
}
sub getProps($$){
  my ($props, $path)=@_;
  my ($key,$value);
  open(FILE, "$path");
  while (<FILE>){
	s/\n//g;
	($key,$value) = split(/:/);
	$props->{$key} = $value;
#print "props: $key | $value\n";
  }

return;
}


sub getTables($){
  my($dbh) 	= shift;
  my($tables)= shift;
  my($table);
  my($sth, $info,@row, $field,$ndx,@prKeys, $prKeyNdx,%columns,);
  $ndx =0;

 # $sth = $dbh->table_info('','public'  );
#http://search.cpan.org/~timb/DBI/DBI.pm#table_info
#  $sth = $dbh->table_info( $catalog, $schema, $table, $type );
#  $sth = $dbh->table_info( $catalog, $schema, $table, $type, \%attr );
# 0.TABLE_CAT: Table catalog identifier. This field is NULL (undef) if not applicable to the data source, which is usually the case. This field is empty if not applicable to the table.
# 1.TABLE_SCHEM: The name of the schema containing the TABLE_NAME value. This field is NULL (undef) if not applicable to data source, and empty if not applicable to the table.
# 2.TABLE_NAME: Name of the table (or view, synonym, etc).
# 3.TABLE_TYPE: One of the following: "TABLE", "VIEW", "SYSTEM TABLE", "GLOBAL TEMPORARY", "LOCAL TEMPORARY", "ALIAS", "SYNONYM" or a type identifier that is specific to the data source.
# 4.REMARKS: A description of the table. May be NULL (undef).
my(@columnhashref);#create an array of hashrefs for the columns to get a new hashref to send into the table hash
my($ndx)=0;
my(@prKeyArrayref);
my(@ordPosArrayref);
$sth = $dbh->prepare("SELECT table_name, table_type FROM information_schema.tables where table_schema ='public'");
$sth->execute();
  while (@row = $sth->fetchrow) { 
#print " table: $row[0] ";
	#next if ($row[3] eq "SYSTEM TABLE"); 
	#next if ($row[3] eq "SYSTEM VIEW"); 
	$table = $row[0];
	$columnhashref[$ndx]={};
	$prKeyArrayref[$ndx]=[];
	$ordPosArrayref[$ndx]=[];
	&getFields($dbh, $table, $columnhashref[$ndx],$prKeyArrayref[$ndx], $ordPosArrayref[$ndx]);
	$tables->{$table} = {	type =>$row[1], 
				columns => $columnhashref[$ndx], 
				prkeys =>$prKeyArrayref[$ndx],	
				col_ord_pos => $ordPosArrayref[$ndx],			 
				java_name=>lcfirst(toCC($table))
	};
	

	$ndx++;


  }

#print "\nclient Type: $tables->{'client'}->{'type'}\n";
#print "\nclient.client_id prkey : $tables->{'client'}->{'columns'}->{'client_id'}->{'prkey'}\n";
#print "\nclient.client_id name : $tables->{'client'}->{'columns'}->{'client_id'}->{'column_name'}\n";
}

############################################################
sub getFields{
	my($dbh) = shift;
	my($table) = shift;
	my($columns) = shift;
	my($prKeys) = shift;
	my($ordPos) = shift;
	my($schema) = shift;
	my($sth, $row, $field,@prKeys, ,$schema, $catalog, $isPrKey,$isAutoInc, $columnDef, $ndx);
#print "DEBUG: inGetFields\n";

	$catalog ='';#Postgres	
	$schema ='';#Postgres
	#@prKeys = $dbh->primary_key($catalog, $schema, $table );
	#print "DEBUG About to call primary keys $table\n";
	@$prKeys = $dbh->primary_key($catalog, $schema,$table );
	#print "DEBUG: just finished prkeys, calling Column info\n";
	$sth = $dbh->prepare( "SELECT * FROM information_schema.columns WHERE table_name = '$table' order by ordinal_position;"); #postgres
    	$sth->execute();
	while ($row = $sth->fetchrow_hashref) {
	  $isPrKey="N";
	  $isAutoInc="N";
	  foreach(@$prKeys){ #Note the while is looping over each field
	    if( $row->{column_name} eq $_ ){ $isPrKey="Y"; last; }		
	  }
	  if( $row->{column_default} =~/nextval/ ){ $isAutoInc="Y";  }

	  $row->{prkey} = $isPrKey;
	  $row->{auto_inc} = $isAutoInc;
	  $row->{java_name}=lcfirst(toCC($row->{column_name}));
	  $row->{english_name}=&toEnglish($row->{column_name});
	  $row->{java_type}= &getJavaType($row->{data_type});
	  $row->{java_sql_type}= &getJavaSQLType($row->{data_type});
	  $row->{boxed_type} =&getBoxedType($row->{data_type});
	  $row->{smart_field_type} =&getSmartFieldType($row->{data_type});
	  $row->{data_type} =~ s/ without time zone//;
	  $row->{ord_pos} = $ndx;
	  $row->{get_method} = &getGetMethod( $row->{java_name}, $row->{java_type} );
	  $columns->{$row->{column_name}} =$row;
	  $ordPos->[$ndx++] = $row->{column_name};
	  
#$columns->{$row->{column_name}} =$row;
#print "DEBUG: in get fields1 - $row->{column_name}\n";
#print "DEBUG: in get fieldsprkey - $columns->{'client_id'}{'prkey'}\n";
#print "DEBUG: in getfields clientidprkey - $columns->{'client_id'}->{'prkey'}\n";
#print "DEBUG: in getfields datatype- $columns->{'client_id'}->{'data_type'}\n";
      }


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
sub toEnglish{
my($in) = shift;
  my($out)="";
  my(@parts) = split(/_/,$in);
  my($ndx)=0;
  #$out = $parts[0];
  for( $ndx =0;$ndx<= $#parts;$ndx++){ $out .= ucfirst($parts[$ndx]) . " "; }
  $out =~ s/ $//;
  return $out;

}
sub getJavaType($){
  my($in) = shift;
  my($out)="";
  my($JavaType)= {
    	"text"=>"String",
	"integer" =>"int",
	"timestamp without time zone" =>"Date",
	"character"=>"String",
	"character varying"=>"String"

  };
$out =  $JavaType->{$in};
if ($out eq ""){ die " missing java type: $in\n";}
return $out;

}

sub getJavaSQLType($){
  my($in) = shift;
  my($out)="";
  my($JavaType)= {
    	"text"=>"String",
	"integer" =>"Int",
	"timestamp without time zone" =>"Timestamp",
	"character"=>"String",
	"character varying"=>"String"

  };
$out =  $JavaType->{$in};
if ($out eq ""){ die " missing  javasql type: $in\n";}
return $out;

}


sub getBoxedType($){
  my($in) = shift;
  my($out)="";
  my($BoxedType)= {
    	"text"=>"String",
	"integer" =>"Integer",
	"timestamp without time zone" =>"Date",
	"character"=>"String",
	"character varying"=>"String"

  };
$out =  $BoxedType->{$in};
if ($out eq ""){ die " missing boxed type: $in\n";}
return $out;
}

sub getSmartFieldType($){
  my($in) = shift;
  my($out)="";
  my($SmartType)= {
    	"text"=>"Text",
	"integer" =>"Integer",
	"timestamp without time zone" =>"Date",
	"character"=>"Text",
	"character varying"=>"Text"

  };
$out =  $SmartType->{$in};
if ($out eq ""){ die " missing type: $in\n";}
return $out;
}


sub getGetMethod($$){
  my $javaname_ = shift;
  my $javatype_ = shift;
  my $prefix ="get";
    if ($javatype_ eq "boolean"){$prefix = "is";}
  return $prefix. ucfirst($javaname_);
}


sub ucf($){
	return ucfirst(shift);
}
sub lcf($){
	return lcfirst(shift);
}

return 1;

