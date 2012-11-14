require 'rspec/core/formatters/html_formatter'

class TestFormatter < RSpec::Core::Formatters::HtmlFormatter

class TestFormatter < RSpec::Core::Formatters::HtmlFormatter
  def example_passed(example)
    move_progress
    @output.puts "    <dd class=\"example passed\"><span class=\"passed_spec_name\">#{h(example.description)}"
    @output.print "    <br />#{h(example.metadata[:verify])}</span></dd>"
    @output.flush
  end
end
  

def example_failed(example)
    #super(example)
    exception = example.metadata[:execution_result][:exception]
    extra = extra_failure_content(exception)
    failure_style = RSpec::Core::PendingExampleFixedError === exception ? 'pending_fixed' : 'failed'
    @output.puts "    <script type=\"text/javascript\">makeRed('rspec-header');</script>" unless @header_red
    @header_red = true
    @output.puts "    <script type=\"text/javascript\">makeRed('div_group_#{example_group_number}');</script>" unless @example_group_red
    @output.puts "    <script type=\"text/javascript\">makeRed('example_group_#{example_group_number}');</script>" unless @example_group_red
    @example_group_red = true
    move_progress
    @output.puts "    <dd class=\"example #{failure_style}\">"
    @output.puts "      <span class=\"failed_spec_name\">#{h(example.description)}</span>"
    @output.puts "      <div class=\"failure\" id=\"failure_#{@failed_examples.size}\">"
    @output.puts "        <div class=\"message\"><pre>#{h(exception.message)}</pre></div>" unless exception.nil?
    #@output.puts "        <div class=\"backtrace\"><pre>#{format_backtrace(exception.backtrace, example).join("\n")}</pre></div>" if exception
    @output.puts extra unless extra == ""
    @output.puts "      </div>"
    @output.puts "    </dd>"
    @output.flush
  end
end
