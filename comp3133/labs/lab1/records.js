const fs = require ('f')

const filePath = '

console.log("Trying to process data from ${filePath} and create individual files for each program")

//CSV file - comma seperated values - 'utf-8' encoding
fs.readFile(filePath (err, data => {
	if err 
		console.log(unable to read from ${filePath
	else if (data)
		// console.log(data from file ${data}
			

	const  rows = data.split("\n")
	let fields = []
	let program = ""
	let filePathToWrite = ""
	let dataToWrite = ""

	rows,forEach ( => {
		fields = record.split(",")
		program = fields(2)

		if program !== undefined
