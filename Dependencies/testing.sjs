@module Testing
@version 0.0.0 (19-Jun-2007)
@target JavaScript
| The testing module implements a simple stateful test engine.
|
| NOTE _________________________________________________________________________
| This engine is designed to be used mainly with the JavaScript backend, and was
| written so that it does not depend on the sugar runtime libraries.

@shared TestCount:Integer  = 0
@shared CurrentTest:String = Undefined
@shared Results:List       = []


| Callback invoked if a test is started
@shared OnTestStart:Function  = Undefined
| Callback invoked if a test is ended
@shared OnTestEnd:Function    = Undefined
| Callback invoked if a test assertion fails
@shared OnFailure:Function    = Undefined
| Callback invoked if a test assertion succeeds
@shared OnSuccess:Function    = Undefined

@function test:Integer name
| Notifies that a new test has begun. The given 'name' will be the
| test description. This returns an identifier (as an int) that will allow to
| access the test.
|
| If there is a previous test, and it was not ended, this will also end the
| previous test.
	var test_id = TestCount
	# We trigger the callbacks first so that we do not have problems with timing
	# by introduce the callback execution time
	if TestCount > 0 -> end(test_id - 1)
	if OnTestStart -> OnTestStart(test_id, name)
	CurrentTest = name
	Results push {
		tid:test_id
		status:"S"
		name:name
		start:(new Date() getMilliseconds())
		tests:[]
	}
	# console log ("Test " + test_id + ": " + name )
	TestCount  += 1
	return test_id
@end

@function end testID
| Ends the test with the given 'testID' (or the last test if no ID was given).
| Note that a test can only be ended once.
	if testID is Undefined -> testID = TestCount - 1
	var test = Results[testID] 
	if test ended -> return True
	test end   = new Date() getMilliseconds()
	test run   = (test end) - (test start)
	test ended = True
	if OnTestEnd -> OnTestEnd(testID, test)
@end

@function fail reason
| Fails the current test with the given reason
	# console log (" failure: " + reason)
	var test_id = TestCount - 1
	Results[ test_id ] tests push {result:"F", reason:reason}
	Results[ test_id ] status = "F"
	# TODO: Remove callback execution time
	if OnFailure -> OnFailure(test_id, Results[test_id] tests length - 1, reason)
	return False
@end

@function succeed
| Success the current test
	#console log (" success !")
	var test_id = TestCount - 1
	Results[ test_id ] tests push {result:"S"}
	# TODO: Remove callback execution time
	if OnSuccess -> OnSuccess(test_id, Results[test_id] tests length - 1)
	return True
@end

@function asTrue val
| Alias for 'value(val, True)'
	return value (val, True)
@end

@function asFalse val
| Alias for 'value(val, False)'
	return value (val, False)
@end

@function asUndefined val
| Alias for 'value(val==Undefined, True)'
	return value (val == Undefined, True)
@end

@function asDefined val
| Alias for 'value(val==Undefined, False)'
	return value (val == Undefined, False)
@end

@function unlike value, other
| Unsures that the given 'value' is different from the 'other' value
	if value == other
		fail ("Values are expected to be different '" + value + "' vs '" + other + "'")
	else
		succeed()
	end
@end

@function value value, expected
| Succeeds if the given value is non-null or if the given value equals the other
| expected value.
	if expected != Undefined
		if value != expected
			return fail ("Expected value to be '" + expected + "', got '" + value + "'")
		else
			return succeed()
		end
	else
		if value is Undefined
			return fail "Value expected to be defined"
		if not value
			return fail "Value expected to be non-null"
		else
			return succeed()
		end
	end
@end

# EOF
