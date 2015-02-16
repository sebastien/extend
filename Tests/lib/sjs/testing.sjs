# -----------------------------------------------------------------------------
# Project   : Testing
# -----------------------------------------------------------------------------
# Author    : Sebastien Pierre                            <sebastien@ffctn.com>
# License   : Revised BSD License
# -----------------------------------------------------------------------------
# Creation  : 28-Jun-2007
# Last mod  : 16-Feb-2015
# -----------------------------------------------------------------------------

@module  testing
@version 0.6.4

| The testing module implements a simple stateful test engine that allows to
| quickly setup and run tests.
|
| NOTE _________________________________________________________________________
| This engine is designed to be used mainly with the JavaScript backend, and was
| written so that it does not depend on the sugar runtime libraries.

# TODO: Add way to count assertion, or at least to refer to the line of the
# invocation.

# FIXME: Make sure callbacks are called only once, add a on all test
# end callback and show some message when all the tests are done.

@shared DEFAULT_TEST_TIMEOUT     = 5  * 1000
@shared DEFAULT_TESTCASE_TIMEOUT = 10 * 1000

@shared TestCount:Integer  = 0
@shared CaseCount:Integer  = 0
@shared CurrentTest:String = Undefined
@shared PredicateStack     = []
@shared Results:List       = []

@shared Callbacks = {
	OnCaseStart : Undefined
	OnCaseEnd   : Undefined
	OnTestStart : Undefined
	OnTestEnd   : Undefined
	OnFailure   : Undefined
	OnSuccess   : Undefined
	OnNote      : Undefined
	OnLog       : Undefined
}

@shared OPTIONS = {
	PRECISION         :0.0001
	FORMAT_PRECISION  :4
	ExceptionOnFailure:False
}

# ------------------------------------------------------------------------------
# OPTION MANAGEMENT
# ------------------------------------------------------------------------------

@function option name, value
	OPTIONS[name] = value
	return testing
@end

@function enable option
	OPTIONS[option] = True
	return testing
@end

@function disable option
	OPTIONS[option] = False
	return testing
@end

@function setPRECISION precision
	OPTIONS PRECISION = precision
@end

# ------------------------------------------------------------------------------
# CREATING A NEW TEST CASE
# ------------------------------------------------------------------------------

@function testCase:Integer name, timeout=DEFAULT_TESTCASE_TIMEOUT
| Creates a new test case with the given name, and returns the identifier of the
| test case.
	if isDefined (window)
		HTMLReporter Install ()
	end
	var case_id = CaseCount
	if CaseCount > 0 -> endCase (case_id - 1)
	if Callbacks OnCaseStart -> Callbacks OnCaseStart (case_id, name)
	CurrentCase = name
	return testing
@end

@function endCase:Integer caseID=(CaseCount - 1)
| Notifies the end of the give test case
	# TODO: Give name and time for case ending
	endTest ()
	if Callbacks OnCaseEnd -> Callbacks OnCaseEnd (caseID)
	return testing
@end

# ------------------------------------------------------------------------------
# CREATING A NEW TEST
# ------------------------------------------------------------------------------

@function test:Integer name, timeout=DEFAULT_TEST_TIMEOUT
| Notifies that a new test has begun. The given 'name' will be the
| test description. This returns an identifier (as an int) that will allow to
| access the test.
|
| If there is a previous test, and it was not ended, this will also end the
| previous test.
	HTMLReporter Install ()
	var test_id = TestCount
	# We trigger the callbacks first so that we do not have problems with timing
	# by introduce the callback execution time
	if TestCount > 0 -> end (test_id - 1)
	if Callbacks OnTestStart -> Callbacks OnTestStart (test_id, name)
	CurrentTest = name
	Results push {
		tid    : test_id
		cid    : CaseCount
		status : "S"
		name   : name
		start  : (new Date() getTime())
		tests  : []
	}
	TestCount  += 1
	return testing
@end

@function currentTest
	return TestCount - 1
@end

# ------------------------------------------------------------------------------
# ENDING A TEST
# ------------------------------------------------------------------------------

@function endTest testID=Undefined
	return end (testID)
@end

@function end testID=Undefined
| Ends the test with the given 'testID' (or the last test if no ID was given).
| Note that a test can only be ended once.
	if testID is Undefined -> testID = TestCount - 1
	var test = Results[testID]
	if test ended -> return True
	test end   = new Date() getTime()
	test run   = (test end) - (test start)
	test ended = True
	console log ("TEST", test, test start, test end, "=", test run)
	if Callbacks OnTestEnd -> Callbacks OnTestEnd(testID, test)
	endCase ()
	return testing
@end

# ------------------------------------------------------------------------------
# FAILING THE CURRENT TEST
# ------------------------------------------------------------------------------

# FIXME: This should take an optional test id parameter

@function fail reason, label
| Fails the current test with the given reason
	if PredicateStack length == 0
		var test_id = TestCount - 1
		Results[ test_id ] tests push {result:"F", reason:reason, label:label}
		Results[ test_id ] status = "F"
		# TODO: Remove callback execution time
		if Callbacks OnFailure -> Callbacks OnFailure (test_id, Results[test_id] tests length - 1, reason, label)
		if OPTIONS ExceptionOnFailure
			note ("Test interrupted by exception (see OPTIONS ExceptionOnFailure)")
			raise (reason)
		end
		return False
	else
		return reason
	end
@end

# ------------------------------------------------------------------------------
# SUCCEEDING THE CURRENT TEST
# ------------------------------------------------------------------------------

# FIXME: This should take an optional test id parameter

@function succeed
| Success the current test
	# console log (" success !")
	if PredicateStack length == 0
		var test_id = TestCount - 1
		Results[ test_id ] tests push {result:"S"}
		# TODO: Remove callback execution time
		if Callbacks OnSuccess -> Callbacks OnSuccess(test_id, Results[test_id] tests length - 1)
	end
	return True
@end

# ------------------------------------------------------------------------------
# FEEDBACK
# ------------------------------------------------------------------------------

@function note message
	if Callbacks OnNote -> Callbacks OnNote (message)
@end

@function log args...
	if Callbacks OnLog -> Callbacks OnLog (args join " ")
@end

# ------------------------------------------------------------------------------
# TRYING A FUNCTION
# ------------------------------------------------------------------------------

@function run callback
| Runs the given callback function in a 'try...' catch clause. Exceptions
| will be absorbed and not propagated back in the containing code.
|
| Ex: 'testing run { ... }'
	try
		callback()
	catch e
		fail ("Test failed with exception: " + e)
	end
	return testing
@end

@function expectException callback
| Expects an exception being raised when executing the given callback
|
| Ex: 'testing expectException { ... }'
	try
		callback ()
		fail     ()
	catch e
		succeed ()
	end
	return testing
@end

@function expectFailure callback, args...
	PredicateStack push (expectFailure)
	var result = callback apply (self, args)
	PredicateStack pop ()
	if result is True
		return fail "A failure was expected"
	else
		return succeed ()
	end
@end

# ------------------------------------------------------------------------------
# PREDICATES
# ------------------------------------------------------------------------------

@shared PREDICATES = {
	ensure:ensure
	asTrue:asTrue
	asFalse:asFalse
	asNull:asNull
	asUndefined:asUndefined
	asDefined:asDefined
	asUndefined:asUndefined
	unlike:unlike
	same:same
	almost:almost
	value:value
}

@function ensure val, message=Undefined
| Really just an alias for 'asTrue'
	if isList( val )
		if val length > 0
			return succeed ()
		else
			return fail(message or ("Value should not be empty: " + format(val)))
		end
	elif isObject (val) and isDefined (val length)
		if val length > 0
			return succeed ()
		else
			return fail(message or ("Value should not have length=0: " + format(val)))
		end
	elif val
		return succeed ()
	else
		return fail(message or ("Value should be true, non-null, got: " + format (val)))
	end
@end

@function asTrue val, message=Undefined
| Alias for 'value(val, True)'
	if not (val is True)
		return fail (message or ("Value should be 'true', got " + format(val)))
	else
		return succeed ()
	end
@end

@function asFalse val, message=Undefined
| Alias for 'value(val, False)'
	if not (val is False)
		return fail (message or ("Value should be 'false', got " + format(val)))
	else
		return succeed ()
	end
@end

@function asNull val, message=Undefined
	if not (val is null)
		return fail (message or ("Value should be 'null', got " + format(val)))
	else
		return succeed ()
	end
@end

@function asUndefined val, message=Undefined
| Alias for 'value(val==Undefined, True)'
	if not (val is Undefined)
		return fail (message or ("Value should be 'undefined', got " +  format(val)))
	else
		return succeed ()
	end
@end

@function asDefined val, message=Undefined
| Alias for 'value(val==Undefined, False)'
	if not isDefined (val)
		return fail (message or ("Value should be defined, got " + format(val)))
	else
		return succeed()
	end
@end

@function unlike value, other, message=Undefined
| Unsures that the given 'value' is different from the 'other' value
	if value == other
		return fail (message or ("Values are expected to be different '" + value + "' vs '" + other + "'"))
	else
		return succeed()
	end
@end

@function same val, expected, message
| Same is a better version of 'value' that will introspect dictionaries and
| lists to check that the keys and items are the same.
	var result  = True
	PredicateStack push (same)
	if isList (expected)
		if isList (val)
			expected :: {v,i|
				# TODO: We should break
				if (i >= val length) or ( (same (val[i], v)) != True) -> result = False
			}
			if result != True
				result = "The lists are different"
			end
		else
			result = "A list is expected"
		end
	elif isMap (expected)
		if isMap (val)
			expected :: {v,i|
				# TODO: We should break
				if (same (val[i], v) != True) -> result = False
			}
			if not result
				result = "The maps are different"
			end
		else
			result =  "A map was expected"
		end
	else
		result = value(val, expected)
	end
	PredicateStack pop ()
	if result is True
		return succeed ()
	else
		return fail (message or result)
	end
@end

@function almost value, expected, label=Undefined
	if isNumber (value) and isNumber (value)
		var delta =Math abs (value - expected)
		if delta < OPTIONS PRECISION
			return succeed ()
		else
			return fail ("almost: '" + format(value) + "' != '" + format(expected) + "' precision=" + OPTIONS PRECISION, label)
		end
	else
		return equals (value ,expected)
	end
@end

@function identical value, expected
	if value is expected
		return succeed ()
	else
		return fail ("identical: '" + format (value) + "' !== '" + format (expected) + "'")
	end
@end

@function equals value, expected
	if extend cmp (value, expected) == 0
		return succeed ()
	else
		return fail ("equals: '" + format (value) + "' != '" + format (expected) + "'")
	end
@end

@function format value
	console log (value, isList(value))
	if isString (value)
		return value
	elif isNumber (value)
		var v = ("" + value) split "."
		var d = v[0]
		var p = v[1]
		if p
			return d + "." + p[0:OPTIONS FORMAT_PRECISION]
		else
			return d
		end
	elif isList (value)
		return JSON stringify (extend map (value, {_|return _}))
	elif isObject (value)
		return JSON stringify (value)
	else
		return "" + value
	end
@end

@function value value, expected
| Succeeds if the given value is non-null or if the given value equals the other
| expected value.
	if expected != Undefined
		if value != expected
			return fail ("value: Expected value to be '" + format(expected) + "', got '" + format(value) + "'")
		else
			return succeed()
		end
	else
		if value is expected
			return succeed ()
		elif value is Undefined
			return fail "value: Value expected to be defined"
		elif not value
			return fail "value: Value expected to be non-null"
		else
			return succeed()
		end
	end
@end

@function _getPredicateCaller level=2
	var called_function = getCaller
	while level > 0
		called_function = called_function caller
		level -= 1
	end
	return called_function
@end

# --------------------------------------------------------------------------
#
# Test Case
#
# --------------------------------------------------------------------------

@class TestCase
| A test case is a collection of tests units

	@property name
	@property tests = []

	@constructor name = (self getClass() getName())
	| Creates a test case with the given name (which is the class name by
	| default).
		self name = name
	@end

	@method add tests...
	| Adds the given tests to this test case tests list
		tests :: {t| self tests push (t)}
	@end

	@method run
	| Run all the tests registered in this test case.
		testCase (name)
		tests :: {t| t run () }
		endCase ()
	@end

@end

# --------------------------------------------------------------------------
#
# Test Unit
#
# --------------------------------------------------------------------------

@class TestUnit
| A test unit is a collection of individual tests exercising one or a
| set of strongly related components.

	@shared   ensure = testing
	@property name

	@constructor name = (self getClass() getName())
		self name = name
	@end

	@method run
		self getClass() listMethods() :: {m,n|
			if n indexOf "test" == 0
				runTest (m,n)
			end
		}
	@end

	@method runTest testFunction, name
		test (name)
		testFunction()
		end ()
	@end

@end

# --------------------------------------------------------------------------
#
# Test Unit
#
# --------------------------------------------------------------------------

@class HTMLReporter

	@shared   Instance
	@property ui
	@property uis = {
		table : Undefined
	}

	@property callbacks

	@operation Install context=Undefined
	| Installs a new 'HTMLReporter' in the testing module. This returns the
	| newly installed instance
		if not Instance
			Instance = new HTMLReporter (context)
		end
		testing Callbacks = Instance callbacks
		return Install
	@end


	@constructor ui="#testing-results"
		self ui = $ (ui)
		ensureUI ()
		callbacks = {
			OnCaseStart: onCaseStart
			OnCaseEnd:   onCaseEnd
			OnTestStart: onTestStart
			OnTestEnd:   onTestEnd
			OnSuccess:   onSuccess
			OnFailure:   onFailure
			OnNote:      onNote
			OnLog:       onLog
		}
	@end

	@method ensureUI
	| Ensures that there is the proper HTML node in the document to add the
	| results, otherwise creates it.
		if (not ui) or (ui length == 0) or (not uis table) or (uis talbe length == 0)
			if not ui or ui length == 0
				ui = html div {id:"testing-results"}
				document appendChild (ui)
				ui = $ (ui)
			end
			uis table = ui find ".table"
			if (not uis table) or (uis table length == 0)
				uis table = $ (html table ())
				ui append (uis table)
			end
			ui addClass "TestResults"
			uis table attr { cellpadding:"0", cellspacing:"0" }
		end
	@end

	@method onCaseStart caseID, name
		var test_row = html tr (
			{ id:"testcase_" + caseID, class:"testcase"}
			html td  ({class:"testcase-name",colspan:"3"}, "" + name)
		)
		uis table append (test_row)
	@end

	@method onCaseEnd
	@end

	@method onNote message
		var test_row = $("#test_" + currentTest())
		$(".notes", test_row) append (html li(message)) removeClass "empty"
	@end

	@method onLog message
		var test_row = $("#test_" + currentTest())
		var text = $(".log pre", test_row) text () + message + "\n"
		$(".log pre", test_row) text (text) removeClass "empty"
	@end

	@method onTestStart testID, testName
		var test_row = html tr (
			{
				id    : "test_" + testID
				class : "test test-running"
			}
			html td  ({class:"test-id"},"#" + testID )
			html td  (
				{class:"test-name"}
				"" + testName
				html div (
					html ul {class:"assertions empty"}
				)
				html div (
					html ul {class:"notes empty"}
				)
				html div ({class:"log empty"},html pre ())
			)
			html td({class:"test-time"}, "running...")
		)
		uis table append (test_row)
	@end

	@method onTestEnd testID, test
		var test_row = $("#test_" + testID)
		$ (test_row) removeClass "test-running"
		if test status == "S"
			$(test_row) addClass "test-succeeded"
		else
			$(test_row) addClass "test-failed"
		end
		$(".test-time", test_row) html ( test run + "ms" )
	@end

	@method onSuccess
	@end

	@method onFailure testID, num, reason, label
		$ ("#test_" + testID +" .assertions") removeClass "empty"
		$ ("#test_" + testID +" .assertions") append (
			html li (
				{class:"assertion assertion-failed"}
				"Assertion #" + (num + 1) + (label and (" [" + label + "]") or "") + " failed: " + reason
			)
		)
	@end

@end

# EOF
