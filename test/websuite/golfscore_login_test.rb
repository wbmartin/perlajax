require 'rspec'
require 'watir-webdriver'
require './app'

describe "A golf score login" do
	before :all do
		@app = App.instance
	end
	before :each do

	end


	it "should allow entry for correct password" do
		@app.goodlogin()
		@app.browser.link(:id,'launcherHome').should be_visible
	end

	it "should logout when asked" do
	  @app.logout()
	  @app.browser.button(:id, 'cmdlogin').should be_visible
	end

	it "should deny entry for incorrect password" do
		@app.login('badlogin','badpassword')
		@app.browser.link(:id,'launcherHome').should_not be_visible
		@app.browser.text.include? 'Sorry'
		@app.browser.button(:text, "Ok").click
	end

	it "should complain if user name is not entered" do 
	  @app.login('','bad password')
		@app.browser.span(:id, 'LoginPortalForm-user_idError').text.include? 'Required'
	end

	it "should complain if password is not entered" do 
		@app.login('bad uname','')
		@app.browser.span(:id, 'LoginPortalForm-passwordError').text.include? 'Required'
	end



	after :each do
	end
	after :all do
	end
end
