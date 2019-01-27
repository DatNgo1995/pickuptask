function calculateMedian(result){
    let array=[]
    /*if an array has a even number of elements, median is the avarage of 2 middle ones.
    if an array has a odd number of elements, median is the middle ones.
    */
    for (let key in result){
        let checkLength = result[key].length
        if (checkLength%2 === 0){    
            array.push([key, (result[key][checkLength/2-1]+ result[key][checkLength/2])/2]) 
        }
        else {
            array.push([key, result[key][(checkLength-1)/2]])
        }
    }
    
    return array
}

