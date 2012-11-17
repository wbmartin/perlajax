require 'rspec'
require 'watir-webdriver'
require './app'

describe "A quick golf score" do
	before :all do
		@app = App.instance
		@app.browser.goto("http://localhost/firstapp")
	end


	it "can be reached from the launcher" do
		@app.goodlogin()
		@app.setSecurityPrivilegeStatus('G',[5,6,7,8,9])
		@app.browser.link(:id,'launcherShowQuickGolfScore').click
		@app.letDustSettle
		@app.browser.text.should match /Recent Golf Scores/
	end
	
	it "can be deleted" do
		@app.letDustSettle
		@app.browser.div(:id,'quickGolfScoreListTable_length').select_list.select 100
@app.letDustSettle
		@app.browser.table(:id,'quickGolfScoreListTable').links.each do |l|
			if l.text == 'Delete' then 
				l.click
				@app.letDustSettle
			end
		end
				@app.letDustSettle
		@app.browser.text.should match /No data available in table/
	end


	it 'can be added' do
		if @app.browser.button(:id,'quickGolfScoreFormClear').visible? then
			@app.browser.button(:id,'quickGolfScoreFormClear').click
			@app.letDustSettle
		end
		@app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').select('New 1 Golfer')
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').set('20')
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').set('11/13/2012')
		@app.browser.send_keys :enter
		@app.letDustSettle
		@app.browser.button(:id,'quickGolfScoreFormAdd').click
		@app.letDustSettle
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /New 1 Golfer/
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /20/
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /11\/13\/2012/
	end

	it 'can be edited' do
    @app.browser.table(:id,'quickGolfScoreListTable').rows[1].links(:text, 'Edit')[0].click
		@app.letDustSettle
		@app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').text.should == 'New 1 Golfer'
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').value.should == '20'
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').value.should == '11/13/2012'
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').set('30')
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').set('11/14/2012')
		@app.browser.send_keys :enter
		@app.letDustSettle
		@app.browser.button(:id,'quickGolfScoreFormSave').click
		@app.letDustSettle
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /New 1 Golfer/
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /30/
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].text.should match /11\/14\/2012/
	end

	it 'can be edited and then canceled' do
	  @app.browser.table(:id,'quickGolfScoreListTable').rows[1].links(:text, 'Edit')[0].click
		@app.letDustSettle
		@app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').text.should == 'New 1 Golfer'
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').value.should == '30'
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').value.should == '11/14/2012'
		@app.browser.button(:id,'quickGolfScoreFormClear').click
	  @app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').value.should == ''
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').value.should == ''
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').value.should == ''

	end

	it 'can enforce validations' do
		@app.browser.button(:id,'quickGolfScoreFormClear').click
		#@app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').select('')
		#@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').clear
		#@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').clear
		#@app.browser.send_keys :enter
		@app.letDustSettle
		@app.browser.button(:id,'quickGolfScoreFormAdd').click
		@app.letDustSettle
		@app.browser.span(:id,'quickGolfScoreForm-golfer_idError').text.should match /Required/
		@app.browser.span(:id,'quickGolfScoreForm-golf_scoreError').text.should match /Integer Input Required/
		@app.browser.span(:id,'quickGolfScoreForm-game_dtError').text.should match /MM\/DD\/YYYY Required/

	end


	it 'can be deleted' do
		@app.browser.table(:id,'quickGolfScoreListTable').rows[1].links(:text, 'Delete')[0].click
		@app.letDustSettle
		@app.browser.text.should match /No data available in table/
	end

	it 'will result in a correct average' do
		addGolfScore('New 1 Golfer', '10', '12/10/2012')
		addGolfScore('New 1 Golfer', '11', '12/11/2012')
		addGolfScore('New 1 Golfer', '12', '12/12/2012')
		addGolfScore('New 1 Golfer', '13', '12/13/2012')
		addGolfScore('New 1 Golfer', '14', '12/14/2012')
		addGolfScore('New 1 Golfer', '15', '12/15/2012')
		addGolfScore('New 1 Golfer', '16', '12/16/2012')
		addGolfScore('New 1 Golfer', '17', '12/17/2012')
		addGolfScore('New 1 Golfer', '18', '12/18/2012')
		addGolfScore('New 1 Golfer', '19', '12/19/2012')
		addGolfScore('New 1 Golfer', '20', '12/20/2012')
	  swapToHandicap
		@app.browser.table(:id,'golfScoreSummaryListTable').rows.each do |r|
		 if (r.text=~ /New 1 Golfer/) then
			 r.text.should match /15.5/
		 end
		end
		swapToScore

	end

	it 'will not effect the average when it is old' do
	addGolfScore('New 1 Golfer', '1000', '12/10/2011')
	swapToHandicap
		@app.browser.table(:id,'golfScoreSummaryListTable').rows.each do |r|
		 if (r.text=~ /New 1 Golfer/) then
			 r.text.should match /15.5/
		 end
		end
		swapToScore

	end

		it 'will not effect the average when it is new' do
	addGolfScore('New 1 Golfer', '30', '12/21/2012')
	swapToHandicap
		@app.browser.table(:id,'golfScoreSummaryListTable').rows.each do |r|
		 if (r.text=~ /New 1 Golfer/) then
			 puts r.text
			 r.text.should match /17.4/
		 end
		end
		swapToScore

	end



	




=begin
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
=end


	after :each do
		@app.letDustSettle
	end
	
	after :all do
	end

  def addGolfScore(golfer_, score_, date_)
    if @app.browser.button(:id,'quickGolfScoreFormClear').visible? then
			@app.browser.button(:id,'quickGolfScoreFormClear').click
			@app.letDustSettle
		end
		@app.browser.select_list(:id,'quickGolfScoreForm-golfer_id').select(golfer_)
		@app.browser.text_field(:id,'quickGolfScoreForm-golf_score').set(score_)
		@app.browser.text_field(:id,'quickGolfScoreForm-game_dt').set(date_)
		@app.browser.send_keys :enter
		@app.letDustSettle
		@app.browser.button(:id,'quickGolfScoreFormAdd').click
	end
	
	def swapToHandicap
		@app.browser.link(:id,'launcherHome').click
		@app.letDustSettle
	  @app.browser.link(:id,'launcherShowHandicaps').click
		@app.letDustSettle
	end

	def swapToScore
    @app.browser.link(:id,'launcherHome').click
		@app.letDustSettle
	  @app.browser.link(:id,'launcherShowQuickGolfScore').click
		@app.letDustSettle
	end


end
