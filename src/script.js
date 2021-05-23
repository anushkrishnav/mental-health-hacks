const {	
	REACT_APP_ASTRA_DB_ID,
	REACT_APP_ASTRA_DB_REGION,
	REACT_APP_ASTRA_DB_KEYSPACE,
	REACT_APP_ASTRA_DB_TABLE,
	REACT_APP_ASTRA_DB_APPLICATION_TOKEN
} = process.env;

const ASTRA_BASE_PATH = `https://${REACT_APP_ASTRA_DB_ID}-${REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com`;
const ASTRA_REST_PATH = `${ASTRA_BASE_PATH}/api/rest/v1/keyspaces/${REACT_APP_ASTRA_DB_KEYSPACE}/`;

class JournalEntry{
	static MOOD_COLOR_VARIABLE = {
		happy: "mood-happy",
		sad: "mood-sad",
		angry: "mood-angry",
		anxious: "mood-anxious",
		imposter-syndrome: "mood-imposter-syndrome"
	};
	
	constructor({
		id,
		userId,
		entry,
		mood,
		date
	}){
		this.id = id;
		this.userId = userId;
		this.entry = entry;
		this.mood = mood;
		this.date = new Date(date);
	}
	
	getMonth(){
		return this.date.getMonth();
	}
	
	getMoodColor{
		return this.constructor.MOOD_CLASS[this.mood];
	}
	
	toJSON(){
		return {
			id: this.id,
			userId: userId,
			entry: this.entry,
			mood: this.mood,
			date: this.date.toISOString().substring(0, 10)
		};
	}
}

async function sendAstraRequestRaw(path, options = {}){
	let url = new URL(path, ASTRA_REST_PATH);
	if(!options.headers)
		options.headers = {};
	options.headers["Content-Type"] = "application/json";
	options.headers["X-Cassandra-Token"] = REACT_APP_ASTRA_DB_APPLICATION_TOKEN;
	
	if(options?.body instanceof Object)
		options.body = JSON.stringify(options.body);
	
	return fetch(url, options);
}

async function sendAstraRequest(url, options){
	return sendAstraRequestRaw(url, options).then(e => e.json());
}

async function saveDocument(document){
	return sendAstraRequest(`tables/${REACT_APP_ASTRA_DB_TABLE}/rows`, {
		method: "PUT",
		data: document.toJSON()
	});
}

async function readDocument(id){
	return sendAstraRequest(`tables/${REACT_APP_ASTRA_DB_TABLE}/rows/` + id);
}