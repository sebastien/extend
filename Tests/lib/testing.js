// 8< ---[Testing.js]---
// The testing module implements a simple stateful test engine.
// 
// NOTE _________________________________________________________________________
// This engine is designed to be used mainly with the JavaScript backend, and was
// written so that it does not depend on the sugar runtime libraries.

var Testing=Testing||{}
var __this__=Testing
Testing._VERSION_='0.0.0';
Testing.TestCount=0
Testing.CurrentTest=undefined
Testing.// Callback invoked if a test is started
Results=[]
Testing.// Callback invoked if a test is ended
OnTestStart=undefined
Testing.// Callback invoked if a test assertion fails
OnTestEnd=undefined
Testing.// Callback invoked if a test assertion succeeds
OnFailure=undefined
Testing.OnSuccess=undefined
Testing.test=	function(name){
		// Notifies that a new test has begun. The given 'name' will be the
		// test description. This returns an identifier (as an int) that will allow to
		// access the test.
		// 
		// If there is a previous test, and it was not ended, this will also end the
		// previous test.
		var __this__=Testing;
		var test_id=Testing.TestCount;
		if ( (Testing.TestCount > 0) )
		{Testing.end((test_id - 1))}
		if ( Testing.OnTestStart )
		{Testing.OnTestStart(test_id, name)}
		Testing.CurrentTest = name;
		Testing.Results.push({'tid':test_id, 'status':'S', 'name':name, 'start':new Date().getMilliseconds(), 'tests':[]})
		Testing.TestCount = (Testing.TestCount + 1);
		return test_id
	}
Testing.end=	function(testID){
		// Ends the test with the given 'testID' (or the last test if no ID was given).
		// Note that a test can only be ended once.
		var __this__=Testing;
		if ( (testID === undefined) )
		{
			testID = (Testing.TestCount - 1);
		}
		var test=Testing.Results[testID];
		if ( test.ended )
		{
			return true
		}
		test.end = new Date().getMilliseconds();
		test.run = (test.end - test.start);
		test.ended = true;
		if ( Testing.OnTestEnd )
		{Testing.OnTestEnd(testID, test)}
	}
Testing.fail=	function(reason){
		// Fails the current test with the given reason
		var __this__=Testing;
		var test_id=(Testing.TestCount - 1);
		Testing.Results[test_id].tests.push({'result':'F', 'reason':reason})
		Testing.Results[test_id].status = 'F';
		if ( Testing.OnFailure )
		{Testing.OnFailure(test_id, (Testing.Results[test_id].tests.length - 1), reason)}
		return false
	}
Testing.succeed=	function(){
		// Success the current test
		var __this__=Testing;
		var test_id=(Testing.TestCount - 1);
		Testing.Results[test_id].tests.push({'result':'S'})
		if ( Testing.OnSuccess )
		{Testing.OnSuccess(test_id, (Testing.Results[test_id].tests.length - 1))}
		return true
	}
Testing.asTrue=	function(val){
		// Alias for 'value(val, True)'
		var __this__=Testing;
		return Testing.value(val, true)
	}
Testing.asFalse=	function(val){
		// Alias for 'value(val, False)'
		var __this__=Testing;
		return Testing.value(val, false)
	}
Testing.asUndefined=	function(val){
		// Alias for 'value(val==Undefined, True)'
		var __this__=Testing;
		return Testing.value((val == undefined), true)
	}
Testing.asDefined=	function(val){
		// Alias for 'value(val==Undefined, False)'
		var __this__=Testing;
		return Testing.value((val == undefined), false)
	}
Testing.same=	function(value, other){
		var __this__=Testing;
		if ( (value == other) )
		{
			Testing.succeed()
		}
		else if ( true )
		{
			Testing.fail((((("Values are expected to be the same '" + value) + "' vs '") + other) + "'"))
		}
	}
Testing.identical=	function(value, other){
		var __this__=Testing;
		if ( (value === other) )
		{
			Testing.succeed()
		}
		else if ( true )
		{
			Testing.fail((((("Values are expected to be identical '" + value) + "' vs '") + other) + "'"))
		}
	}
Testing.unlike=	function(value, other){
		// Unsures that the given 'value' is different from the 'other' value
		var __this__=Testing;
		if ( (value == other) )
		{
			Testing.fail((((("Values are expected to be different '" + value) + "' vs '") + other) + "'"))
		}
		else if ( true )
		{
			Testing.succeed()
		}
	}
Testing.value=	function(value, expected){
		// Succeeds if the given value is non-null or if the given value equals the other
		// expected value.
		var __this__=Testing;
		if ( (expected != undefined) )
		{
			if ( (value != expected) )
			{
				return Testing.fail((((("Expected value to be '" + expected) + "', got '") + value) + "'"))
			}
			else if ( true )
			{
				return Testing.succeed()
			}
		}
		else if ( true )
		{
			if ( (value === undefined) )
			{
				return Testing.fail('Value expected to be defined')
			}
			else if ( (! value) )
			{
				return Testing.fail('Value expected to be non-null')
			}
			else if ( true )
			{
				return Testing.succeed()
			}
		}
	}
Testing.init=	function(){
		var __this__=Testing;
	}
Testing.init()
