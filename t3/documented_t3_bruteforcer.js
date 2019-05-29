function(Z, Y, s, u, a, p, l, P, o, t, m, r) // s:#s.corp.priv, u:"username", m:false
{      // Each lowercase character (and P) in function definition is used to cut down on chars, as we don't have to create them with "var s" for every character

// Z and Y are context and args respectively
// s is scriptor from Y.s
// u is username from Y.u
// a is args object used to call scriptor "s.call(a)"
// p is current pin number from Y.p
// l is scripts.lib()
// P is formatted pin number ("0013" instead of 13, needed for script input and used for output)
// o is s.call(a) output in lowercase
// t is a temporary string used to store the command used to continue bruteforcing
// m is minimal output toggle value from Y.m
// r is regex used to test if brute succeeded

	//Define vars
	l = #fs.scripts.lib();
	s = Y.s
	u = Y.u
	p = Y.p || 0        // If Y.p is 0, null or false, it'll default to 0 - the user doesn't have to set it in args explicitly
	m = Y.m
	a = {username:u}    // Create the object used for calling the corp script - username is static, so we can define it immediately

	r = /pin|incorrect/ // The regex for testing bruteforcing result. It'll find either the string "pin" or "incorrect", which both
	                    // show up if the brute fails, but either can get corrupted

	do  // do{}while loop lets us make sure the pin is set before calling the corp for the first time, letting us spare a few chars on setting the pin twice
	{
		a.pin = P = "0".repeat(4-p.toString().length)+p++
		// We set a.pin to be equal to the result of assigning the rest to P
		// Since assignment returns the assigned value, we can assign the formatted pin to two vars at once

		// p.toString().length tells us how many chars does the pin use in string form, for example 13 would return 2, as there are two chars in "13"
		// By substracting it from 4, we can know how many chars are missing from the full form of 4 digits
		// We then use the value to repeat "0" as many times as necessary
		// For example, for the number 13 we receive "00", as "0" is repeated 2 times (4-"13".length)

		// The incrementation operator (p++) returns the value of the incremented variable BEFORE incrementing it.
		// Thanks to this, if p=4, p++ returns 4 and sets p to be 5
		// This means we can increment p and append it to the string at the same time, again saving us chars

		// Finally, adding "00"+13 returns a string from concatenation, AKA sticking the two values in string form together, in this case "0013"
		// The script then takes the value, puts it in the variable P and in the index pin: "0013", which means we're ready to run the corp script

	} // On the next lines is the condition under which the while loop will continue running - do note that do{}while() runs at least once before exitting

	while(l.can_continue_execution(750) // The can_continue_execution tells us if we have a specific number of milliseconds before the 5-second timeout
	                                    // If we don't, we should immediately stop running so that we can return the current progress safely before timeout
		&&
		r.test(o=s.call(a).toLowerCase())) // The same trick as before is used to store the lowercase script output in o as was seen before with P
		                                   // The function String.toLowerCase() returns the string with all uppercase characters (AFCE) switched to lowercase (afce)
		                                   // Afterwards, the Regexp.test(String) method lets us see if the regex found anything at all in the tested string
		                                   // If we find out that the pin was incorrect, which is what the regex checks, we have to continue cracking as long as we have tim


	// The way this brute works is by returning the next string to copypaste into the console to continue bruteforcing.
	// As such, we have to return the string to run the running script itself with every arg except for p unchanged, where p is replaced with the next pin needed to bruteforce

	t=`     ${Z.this_script}{s:#fs.${s.name}, u:"${u}", p:${p}, m:${m?true:false}}`

	// This template string lets us format the output without doing a lot of concatenation and wasting chars
	// Anything inside ${} inside a template string (`${2+2}`) inputs the string representation of the value in place of the #{} block.
	// The Z.this_script (Z is context) tells us the script of the brute, for example myuser.brute
	// Remember that the following braces {} don't have a $, so they don't get parsed, instead they stay as is, letting us put in the argument block
	// #s.${s.name} - s is the corp scriptor, s.name is the name (for example corp.t3script) and since we want to pass it to the script, we put it in as a scriptor
	// u:"${u}" - very simple, since u is Y.u, we want to put it back
	// m:${m?true:false} - Same as u, except we turn m into a boolean - the a?b:c ternary operator will return b if a is truthy or c if a is falsey
		// Search around for more info about truthy and falsey values.

	// The result is equivalent to the string used to run the original script with p updated to new value

	// Outputting an array lets us output multiple lines in an easily managable way
	return m?[ // The ternary operator is used for the second time in this script to output minimal mode if enabled
		P, // In minimal mode we only output the formatted pin,
		t, // the string needed to continue bruteforcing,
		`diff: ${p-Y.p}` // and the difference between new pin and old pin, to see how many pins were tested

	]:[ // In normal mode we output a few more things as well as empty lines to separate stuff:
		P, // Formatted pin
		`diff: ${p-Y.p}`, // How many pins were tested
		,  // An empty space in the array means nothing is in the line, separating the output visibly
		t,
		t, // The string used to continue bruteforcing is repeated 3 times for easy copying
		t,
		,
		`${s.name}{username:"${u}", pin:"${P}"}`, // In the same way we generated t, we generate the string needed to access the corp with the current pin and username
		                                          // Since the script exits if it finds out the pin wasn't invalid, it's convenient for easily getting into the corp after bruteforcing
		,
		o // o is the lowercase corp output from the last pin attempt, making manual supervision easy when outputted
	]
}