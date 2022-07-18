// result body (input string)
// "{id=101165.0, reasonId=101165.0, reasonCode=291, reasonDescription=Pickup not ready (Packaging not ready, manifest not ready)}"

// return body type of result
// {
//   id: '101165.0',
//   reasonId: '101165.0',
//   reasonCode: '291',
//   reasonDescription: 'Pickup not ready (Packaging not ready, manifest not ready)'
// }

// example function call : 
// stringToJSON("{id=101165.0, reasonId=101165.0, reasonCode=291 reasonDescription=Pickup not ready (Packaging not ready, manifest not ready)}");



const stringToJSON = (s) => {
    let tmp = '';
    let arr = [];
    let flag = 0;
    let specialFlagforReasonDescription = false;
    for(let i = 0; i < s.length; i++) {
        if(s[i] === '=' || s[i] === ':'){
            tmp = tmp.toLowerCase();
            if(tmp === 'reasondescription'){
                specialFlagforReasonDescription = true;
            }
            else{
                specialFlagforReasonDescription = false;
            }
            let p = '';
            
            i++;
            while(specialFlagforReasonDescription === false){
                if(s[i] === ',' || s[i] == '}'){
                    break;
                }
                p+=s[i];
                i++;
            }
            let count  = 0;
            while(specialFlagforReasonDescription === true){
                if(s[i] === ','){
                    count++;
                }
                if(count == 2){
                    break;
                }
                if(s[i] === '}'){
                    break;
                }
                p+=s[i];
                i++;
            }
            let pair = [];
            pair.push(tmp);
            pair.push(p);
            arr.push(pair);
            tmp = '';
        }
        else if((s[i]>='a' && s[i]<='z') || (s[i]>='A' && s[i]<='Z')  ) {
            tmp+=s[i];
        }

    }
    
    let result = {};

    //converting 2D array to JSON OBJECT
    for(let i =0 ;i<arr.length;i++){
        result[arr[i][0]] = arr[i][1];
    }
    // console.log(result);
    return result;
}

 

module.exports = { stringToJSON };
