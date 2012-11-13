require 'watir-webdriver'
require 'rspec'
require './app'

@app = App.instance
@app.goodlogin
@app.setSecurityPrivilegeStatus('R',[2,3,4])
