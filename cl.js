function(context, args)
{
    // Simoyd 2017
    // License: https://creativecommons.org/publicdomain/zero/1.0/legalcode

    // Arguments to pass to the target scriptor
    var b = args.b;
    
    // Corruption characters to clean out
    var corr = #fs.scripts.lib().corruption_chars;
    
    // Our list of input invocations. inputResults.length would be the total times the target was invoked
    var inputResults = [];

    // Performs an invocation of the target scriptor
    var callit = function()
    {
        // Call the scriptor, and pass the body in
        var curInput = args.t.call(b);
        
        // Make sure we always have an array
        if ((typeof curInput) == "string")
        {
            curInput = [ curInput ];
        }

        // Create object with cleaned flag, so we only clean array elements if we actually need it
        for (var i = 0; i < curInput.length; ++i)
        {
            curInput[i] = { content: curInput[i], cleaned: false };
        }
  
        // Save it in our list of input invocations.
        inputResults[inputResults.length] = curInput;
    };
    
    // Cleans a single element of a result array so that indexes match up with other versions.
    // Also cleans color completely if requested
    var ensureClean = function(element)
    {
        // If already cleaned, nothing to do.
        if (element.cleaned)
        {
            return element.content;
        }
    
        var content = element.content;
    
        if ((!args.notcor) || args.color)
        {
            // removes the color codes around corruption
            content = content.replace(new RegExp("`[a-zA-Z0-9](" + corr.split("").join("|") + ")`", 'g'), "$1");
        }
        if (args.color)
        {
            // removes all other color codes
            content = content.replace(/`[0-9A-Za-z](?!(:.?|.?:)`)([^`\n]+)`/g, "$2");
        }
        
        // Content is now clean as per args requirement
        element.cleaned = true;
        return element.content = content;
    }

    // Always perform 1 invocation of the target (duh)
    callit();
    
    // Final output string array
    var finalOutput = [];

    // Loop through all the items in our first invocation
    for (var i = 0; i < inputResults[0].length; ++i)
    {
        // Output for the current item
        var curOutput = "";
        
        // Clean the current item in our first invocation
        var mainContent = ensureClean(inputResults[0][i]);

        if (args.notcor)
        {
            // If we're not cleaning corruption out, then we're done!
            curOutput = mainContent;
        }
        else
        {
            // Go through each character in the current item
            for (var j = 0; j < mainContent.length; ++j)
            {
                var curChar = mainContent[j];
            
                // If there is corruption on this character
                if (corr.indexOf(curChar) > -1)
                {
                    // Search through secondary invocations until we find the uncorrupted character
                    for (var l = 1; true; ++l)
                    {
                        // If we've hit the most number of invocations we've done, then do another invocation
                        if (l == inputResults.length)
                        {
                            callit();
                        }
                        
                        // Ensure the current item for the current secondary invocation is clean,
                        // then get the character at the current index
                        var altContent = ensureClean(inputResults[l][i]);
                        var curAltChar = altContent[j];
                        
                        // If it's not corrupted, add it to our output and move on to the next character,
                        // otherwise loop and look at the same index in the next invocation
                        if (corr.indexOf(curAltChar) < 0)
                        {
                            curOutput += curAltChar;
                            break;
                        }
                    }
                }
                else
                {
                    // If there is no corruption on the character in the first invocation
                    // then just append it to our output
                    curOutput += curChar;
                }
            }
        }
        
        // Add the current item to our final output
        finalOutput[i] = curOutput;
    }

    // Done like dinner
    return finalOutput;
}
