require 'rspec'
require 'watir-webdriver'

describe "An Amazon search" do
  before :all do
    @browser = Watir::Browser.new :chrome
    @browser.goto("http://www.amazon.com")
  end

  def search_for(term)
    @browser.select_list(:id, "searchDropdownBox").select("Books")
    @browser.text_field(:name, 'field-keywords').set(term)
    @browser.button(:title, "Go").click
  end

  it "should display results range" do
    search_for("star wars")
    @browser.text.should match(/Showing .* of .* Results/)
  end

  it "should reflect the search context in the title" do
    search_for("star wars")
    @browser.title.should == "Amazon.com: star wars: Books"
  end

  after :all do
    @browser.close
  end
end
