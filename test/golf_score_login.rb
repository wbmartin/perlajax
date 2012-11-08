require 'rspec'
require 'watir-webdriver'
require './app'

describe "A golf score login" do
	before :all do
		@app = App.new
		@app.browser.goto("http://localhost/firstapp")
	end


	it "should allow entry for correct password" do
		@app.goodlogin()
		@app.browser.link(:id,'SummaryPage').should be_visible
	end

	it "should deny entry for incorrect password" do
		@app.login('badlogin','badpassword')
		@app.browser.link(:id,'SummaryPage').should_not be_visible
		@app.browser.text.include? 'Sorry'
		@app.browser.button(:text, "Ok").click
		#have to get a good login for closure to work
		@app.goodlogin()
	end

	after :each do
		@app.logout()
	end
	after :all do
		@app.destroy
	end
end
