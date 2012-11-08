#!/usr/bin/env ruby
#Install guide: https://github.com/zeljkofilipin/watirbook/blob/master/installation/ubuntu.md

require 'rubygems'
require 'watir-webdriver'
require 'test/unit'

def setup
  # fill in code that will run before every test case here
end
def teardown
  # fill in code that will run after every test case here
end

class LoginPage < Test::Unit::TestCase
	def testPosLogin
		puts 'Opening Browser Chrome'
		b = Watir::Browser.new :chrome
		b.goto "http://localhost/firstapp"
		assert b.text.include?('keepin')
	end
end
