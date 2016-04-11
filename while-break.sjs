# If a function uses iterate, it should return if iterate returns flow.RETURN
@function f list
	for v in list
		console log ("Iterate", v)
		if v == 5
			break
		end
	end

	var l = list length
	var i = 0
	while i < l
		if i == 5
			break
		end
	end
@end

@function forTest
	var v = 0
	var r = []
	for v in [1,2,3,4,5]
		r push {print (v)}
	end



f [1,2,3,4,5,6,7,8]
