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
		@b.link(:id,'logoutButtonId').click
	end
#>>>>>>>>>>>>>>>>>App specific Fields
#	def golfer
#		golfer
#	end

	

end
