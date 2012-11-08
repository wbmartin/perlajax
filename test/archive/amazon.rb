#!/usr/bin/env ruby
require 'rubygems'
require 'watir-webdriver'

class AmazonSearch
  def initialize(this_browser)
    @browser = Watir::Browser.new(this_browser)
  end
  
  def search_test
    begin
      @browser.goto("http://www.amazon.com")
      @browser.select_list(:id, "searchDropdownBox").select("Books")
      @browser.text_field(:name, 'field-keywords').set("star wars")
      @browser.button(:title, "Go").click
      search_test_verify
    ensure
      @browser.close
    end
  end
  
  def search_test_verify
    testResult = @browser.text.match(/Showing .* of .* Results/)
    if testResult != nil
      puts "Result: #{testResult}"
      puts "PASS: Results Count verified."
    else
      puts "FAIL: Results Count not verified."
    end
    
    if @browser.title == "Amazon.com: star wars: Books"
      puts "Result: Title was #{@browser.title}"
      puts "PASS: Title was reflective of content."
    else
      puts "FAIL: Title was not reflective of content."
    end
  end
end

runner = AmazonSearch.new(ARGV[0].to_sym)
runner.search_test
