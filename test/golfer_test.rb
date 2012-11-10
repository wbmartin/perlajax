require 'rspec'
require 'watir-webdriver'
require './app'

describe "A golfer" do
	before :all do
		@app = App.instance
		@app.browser.goto("http://localhost/firstapp")
	end


	it "can be reached from the launcher" do
		@app.goodlogin()
		@app.browser.link(:id,'launcherShowGolfer').click
		@app.letDustSettle
		@app.browser.text.should match /Golfers/
	end

	it "is patient while all the golf scores are deleted" do
		@app.browser.link(:id,'SummaryPage').click
		@app.letDustSettle
		@app.browser.link(:id,'launcherShowQuickGolfScore').click
		@app.letDustSettle
		@app.browser.links.each do |l|
			if l.text =="Delete" then 
				l.click
				@app.letDustSettle
			end
		end
		@app.browser.text.should match /No data available in table/
			@app.browser.link(:id,'SummaryPage').click
		@app.browser.link(:id,'launcherShowGolfer').click
@app.letDustSettle

	end

	it "will allow deletion of all golfers" do
		@app.browser.links.each do |l|
			if l.text == "Delete" then 
				l.click
			end
		end
		@app.browser.text.should match /No data available in table/
			@app.browser.links.each do |l|
			if l.text =="Delete" then 
				l.click
				@app.letDustSettle
			end
			end
		@app.browser.text.should match /No data available in table/

	end

	it "will allow addition of a new golfer" do
		if @app.browser.button(:id,'golferFormClear').visible? then
			@app.browser.button(:id,'golferFormClear').click
			@app.letDustSettle
		end
		@app.browser.text_field(:id,'golferForm-name').set("New Golfer")
		@app.browser.button(:id,'golferFormAdd').click
		@app.letdustSettle
		@app.browser.div(:id,'golferListTableDivId').text.should /New Golfer/

	end

	after :each do
		@app.letDustSettle
	end
	after :all do
	end
end
