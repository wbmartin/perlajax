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
		@app.setSecurityPrivilegeStatus('G',[1,2,3,4])
		@app.browser.link(:id,'launcherShowGolfer').click
		@app.letDustSettle
		@app.browser.text.should match /Golfers/
	end

	it "is patient while all the golf scores are deleted" do
		@app.browser.link(:id,'launcherHome').click
		@app.letDustSettle
		@app.browser.link(:id,'launcherShowQuickGolfScore').click
		@app.letDustSettle
		@app.browser.links.each do |l|
			if l.text == 'Delete' then 
				l.click
				@app.letDustSettle
			end
		end
		@app.browser.text.should match /No data available in table/
			@app.browser.link(:id,'launcherHome').click
		@app.browser.link(:id,'launcherShowGolfer').click
		@app.letDustSettle
	end

	it "will allow deletion of all golfers" do
		@app.browser.links.each do |l|
			if l.text == 'Delete' then 
				l.click
				@app.letDustSettle
			end
		end
		@app.browser.text.should match /No data available in table/
		#	@app.browser.table(:id,'quickGolfScoreListTable').links.each do |l|
		#	if l.text =='Delete' then 
		#		l.click
		#	end
		#	end
		#		@app.letDustSettle
		#@app.browser.text.should match /No data available in table/
	end

	it "can be added" do
		if @app.browser.button(:id,'golferFormClear').visible? then
			@app.browser.button(:id,'golferFormClear').click
			@app.letDustSettle
		end
		@app.browser.text_field(:id,'golferForm-name').set("New Golfer")
		@app.browser.button(:id,'golferFormAdd').click
		@app.letDustSettle
		@app.browser.div(:id,'golferListTableDivId').text.should match /New Golfer/
	end

	it 'can be reset to add mode while editing' do
		@app.letDustSettle
		@app.browser.div(:id, "golferListTableDivId").link(:text,"Edit").click
		@app.letDustSettle
		@app.browser.button(:id, 'golferFormAdd').should_not be_visible
		@app.browser.button(:id, 'golferFormClear').click
		@app.browser.text_field(:id,'golferForm-name').value.should == ''
		@app.browser.button(:id, 'golferFormAdd').should be_visible
	end
	it 'can be updated' do
		@app.letDustSettle
		@app.browser.div(:id, "golferListTableDivId").link(:text,"Edit").click
		@app.letDustSettle
		@app.browser.text_field(:id, 'golferForm-name').value.should == "New Golfer"
		@app.browser.text_field(:id, 'golferForm-name').set('New 1 Golfer')
		@app.browser.button(:id, 'golferFormSave').click
		@app.letDustSettle
		@app.browser.div(:id,'golferListTableDivId').text.should match /New 1 Golfer/
	end

	it 'cant be edited, added, or deleted if security is not granted' do
		@app.setSecurityPrivilegeStatus('R',[2,3,4])
		@app.browser.link(:id,'launcherShowGolfer' ).click
		@app.letDustSettle
		@app.browser.table(:id,'golferListTable').text.should_not match /Edit|Delete/
		@app.setSecurityPrivilegeStatus('G',[2,3,4])	
	end

	it 'cant be accessed if security is not granted' do
		@app.setSecurityPrivilegeStatus('R',[1])
		@app.browser.link(:id,'launcherShowGolfer' ).should_not be_visible
		@app.setSecurityPrivilegeStatus('G',[1])	
	end


	after :each do
		@app.letDustSettle
	end
	after :all do
		@app.logout
	end
end
