# If a function uses iterate, it should return if iterate returns flow.RETURN
@function f list
	for v in list
		console log ("Iterate", v)
		if v == 5
			break
		end
	end
@end

f [1,2,3,4,5,6,7,8]
