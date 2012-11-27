require 'headless'
class App
	Username = 'golfscore'
	Password = 'golfscore'
	Url = 'http://localhost/firstapp'
	RunHeadless = false

	def initialize
		if RunHeadless then
			@headless = Headless.new
			@headless.start
		end
		@b = Watir::Browser.new :chrome
		@b.goto(Url)
	end

	@@instance = App.new

	def self.instance
		return @@instance
	end

	def destroy
		@b.close
		if RunHeadless then
			@headless.destroy
		end
	end

	def browser
		@b
	end

	def letDustSettle()
		while (	@b.span(:id,'outstandingServerCalls').html !~ /Open Requests: 0/) 
			sleep 0.2
		end
		# this extra sleep is needed to let the js finish after the ajaxcalls finish
		sleep 0.3 
	end

	def goodlogin()
		login(Username, Password)
	end
	def login( userId, password)
		@b.text_field(:id, 'LoginPortalForm-user_id').set(userId)
		@b.text_field(:id, 'LoginPortalForm-password').set(password)
		@b.button(:id, "cmdlogin").click
		letDustSettle()
	end
	def logout()
		letDustSettle
		@b.link(:id,'logoutButtonId').click
	end

	def setSecurityPrivilegeStatus(grantOrRevoke, divId_)
		parentDiv = ''
		@b.browser.link(:id,'launcherHome').click
		letDustSettle
		@b.browser.link(:id, 'launcherShowSecuritygrants').click
		#@b.browser.div(:id =>'securityGrantsListTable_filter').text_field.set('admin')
		letDustSettle
		@b.browser.table(:id ,'securityGrantsListTable').rows.each do |r| 
			if r.text =~/default/ then
				r.link(:text,'Edit').click
			end
		end
		letDustSettle
		sleep 2
		if grantOrRevoke == 'G' then
			parentdiv = 'availableGrantsId'
		else
			parentdiv = 'grantedPrivilegesId'
		end
		#rescue Watir::Exception::UnknownObjectException =>e
		divId_.each do |d|
			begin
			grantDivId = 'securityGrant' + d.to_s + 'Id'
			@b.browser.div(:id,parentdiv).div(:id,grantDivId).fire_event('ondblclick')
			rescue => e
	  	#ignore exceptions - most likely priv is already revoked
	    end

		end
		letDustSettle
		@b.browser.link(:id,'launcherHome').click
		refreshCache
		
	end

	def refreshCache
		letDustSettle
		@b.browser.link(:id,'launcherHome').click
		@b.browser.link(:id,'launcherShowHelp').click
		@b.browser.link(:id,'launcherRefreshCache').click
		@b.browser.link(:id,'launcherHome').click
		letDustSettle
	end
	
end
