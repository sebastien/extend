// TEST SETUP ________________________________________________________________
// TODO: Convert to Sugar
testing.HTMLReporter.Install();
$(document).ready(function(){$(".VERSION").html("" + extend.__VERSION__)})

testing.OnTestStart = function(testId, testName) {
	var test_row = html.tr(
		{"id":"test_" + testId, "class":"test testRunning"},
		html.td({"class":"testID"},"#" + testId),
		html.td({"class":"testName"},"" + testName,
		html.div(html.ul({"class":"assertions empty"}))),
		html.td({"class":"testTime"},"running...")
	)
	$("#result").append(test_row)
}
testing.OnTestEnd   = function(testId, test) {
	var test_row = $("#test_" + testId)
	$(test_row).removeClass("testRunning");
	if ( test.status == "S" ) {
		$(test_row).addClass("testSucceeded");
	} else {
		$(test_row).addClass("testFailed");
	}
	$(".testTime", test_row).html(test.run + "ms")
}

testing.OnFailure = function( testId, num, reason ) {
	$("#test_" + testId +" .assertions").removeClass("empty")
	$("#test_" + testId +" .assertions").append(html.li({"class":"assertion assertionFailed"},"Assertion #" + num + " failed: " + reason))
}
// END SETUP

// TEST 0
testing.test("JavaScript Inheritance Basics")
	// SETUP
	var A = function(){this.isClass=function(){return false}}
	var A_proto={
		isClass:function(){return true},
		hello:function(){return "Hello"}
	}
	A.prototype=A_proto
	A_proto.isClass=function(){return true}
	//A.hello=function(){return "Hello"}
	var a = new A()
	// TEST
	testing.asTrue(A_proto.isClass())
	testing.asFalse(a.isClass())
	testing.value(A_proto.hello(),"Hello")
	testing.value(a.hello(),"Hello")
	// Now, this is the fun part: when doing a 'new A()', there is no link
	// between A (or A_proto) and 'a'. When invoking new, it seems like the
	// given object is actually cloned.
	testing.unlike(a,A_proto)
	testing.unlike(a,A)
	testing.unlike(a.prototype,A_proto)
	testing.unlike(a.prototype,A)
	// But strangely, we can add 'otherHello' to "A_proto", and automatically,
	// 'a' will benefit from it.
	A_proto.otherHello=function(){return "Pouet"}
	testing.value(A_proto.otherHello(),"Pouet")
	testing.value(a.otherHello(),"Pouet")
	// And we can check that if we modify the 'class', the instance won't be
	// updated
	A.pouet = function(){return "Pouet"}
	testing.value(A.pouet(),"Pouet")
	testing.asUndefined(a.pouet)
	// But it will if we modify the prototype
	A.prototype.pouet = A.pouet
	testing.asDefined(a.pouet)
	testing.asDefined(a.pouet(),"Pouet")
testing.end()
