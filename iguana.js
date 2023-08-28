require('dotenv').config()
var pJson = require('./package.json')
const fs = require('fs')



function preload() {
  conFont = loadFont('VT323-Regular.ttf')
  verFont = loadFont('Tektur-Black.ttf')
  jpFont = loadFont('NotoSansJP-ExtraLight.ttf')
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  normalMaterial()
  imgIguana = loadImage('iguana.png')
  imgToucan = loadImage('toucan.png')
  textFont(conFont, 36)
  textSize(9)
  frameRate(60)
}

function draw() {
  background(27, 36, 82)
  //moveCamera()
  orbitControl(0.05, 0.05, 0.3, {freeRotation: true})
  iguanaBox() //ver
  toucanBox() //rotating icon
  noiseLoop() //cool circles
  say() //console
  boxesI() // app info
  
  //listeners etc
  if (respond === 'yes') {
    respondLengua()
  }
  if (lenguaCycle === 'yes') {
    evalEval_langIndex() 
  }
  mapsListener()

}

let boxes = []
let index = -1
const processList = [
  "discord",
  "lengua",
  "maps"
]

function boxesI() {
    for (let boxCount of boxes) {
      boxCount.display()
    }
}

function logEvent(x, y, z, eventText) {
  let newBox = new BoxI(x, y, z, eventText)
  boxes.push(newBox)
}

let angleX_Box = 0
let angleY_Box = 0
let targetAngleX_Box = 0
let targetAngleY_Box = 0
let easing_Box = 0.0333

class BoxI {
  constructor(x, y, z, text, text2) {
    this.x = x - width / 2
    this.y = y - height / 2
    this.z = z
    this.text = [text]
    this.text2 = [text2]
  }

  display() {
    let dx_Box = mouseX - width / 2
    let dy_Box = mouseY - height / 2
    targetAngleX_Box = map(dy_Box, -height / 2 + this.y, height / 2 + this.y, -PI / 4, PI / 4)
    targetAngleY_Box = map(dx_Box, -width / 2 + this.x, width / 2 + this.x, -PI / 4, PI / 4)
    //compute diff. between current and target angles
    let diffX_Box = targetAngleX_Box - angleX_Box
    let diffY_Box = targetAngleY_Box - angleY_Box
    //use easing to move angles slowly
    angleX_Box += diffX_Box * easing_Box
    angleY_Box += diffY_Box * easing_Box

    //draw little bounding box
    push()
    translate(this.x, this.y - 3, this.z)
    rotateX(-angleX_Box)
    rotateY(angleY_Box)
    strokeWeight(0.314159)
    stroke(map(strokeColor, 0, 255, 255, 0))
    noFill()
    box(12)
    pop()
    
    //draw main app console text
    push()
    translate(this.x + 20, this.y, this.z + 19)
    fill(255)
    text(this.text.join(' '), -9, 0)
    if (this.text.length > 7) {
      this.text.splice(1, 1)
    }
    rotateX(-angleX_Box * easing)
    rotateY(angleY_Box * easing)
    pop()

    //draw alt text
    push()
    translate(this.x - 9, this.y - 9, this.z)
    fill(255, 255, 228)
    text(this.text2.join(' '), -9, 0)
    if (this.text2.length > 7) {
      this.text2.splice(1, 1)
    }
    pop()
  }

  update(updateText) {
    this.text[0] = updateText
  }

  update2(updateText2) {
    this.text2[0] = updateText2
  }

  addText(newText) {
    this.text.push('\n' + newText)
  }

  addText2(newText2) {
    this.text2.push('\n' + newText2)
  }

  popLast2() {
    this.text2.pop()
  }
}

let respond = 'no'
function doubleClicked() {
  try {
    lenguaCmdie = cmdText
    cmdText = ''
    boxes[langIndex].addText(lenguaCmdie)
    respond = 'yes'
    //console.log(respond)
  } catch(error) {
  console.log('?')
}

}

let cmdText = ''
let typing = ''
let lenguaCycle = 'no'
const commands = ['discord', 'lengua', 'maps']
function keyPressed() {
  if (keyCode === ENTER)  {
    typing = 'no'
    let cmdIE = cmdText
    if (commands.includes(cmdIE)) { //general cmd handler
      eval(cmdIE + '()')
    }

    else if (askOn === 'yes') {     //maps prompt handler
      askOn = 'no'
      askIE = cmdText
      gM()
      askIE = ''
    }
    //clear command text then log ''/clearing mouse text
    cmdText = ''
    console.log(cmdText)
  }
  if (keyCode == ESCAPE) {          //lengua cycling handler
    lenguaCycle = 'yes'
    typing = 'no'
  }
  if (keyCode === BACKSPACE)  {
    cmdText  = cmdText.slice(0, -1)
    console.log(cmdText)
  }
  else if (keyCode !== 13) {
    if (keyCode !== ESCAPE) {
      typing = 'yes'
      cmdText += key;
      console.log(cmdText)
    }
  }
}

//displayConsoleTextAtMousePosition
//definitions for override console.log()
let consoleLog = [];
let _log = console.log;
let conFont;
function say() { 
  //override console.log to print to mouseXY
  console.log = function() {
    consoleLog.push(Array.from(arguments).join(''))
    _log.apply(console, arguments)
    }
  if(consoleLog.length > 0) {
    var message = consoleLog[consoleLog.length - 1]
    fill(255)
    textSize(12)
    //change font
    textFont(conFont)
    text(message, mouseX - width / 2, mouseY - height / 2)
    fill(0, 0 ,0)
  }
}

//draw version text
function iguanaBox() {
  textFont(conFont, 36)
  fill(0, 0 ,0)
  strokeWeight(0)
  //box
  texture(imgIguana)
  box(10)
  textSize(9)
  text(pJson.version, 33, 0)

  push() //save transformations
  rotateX(-angleX)
  rotateY(angleY)
  text(pJson.name, 33, -19)
  fill(255)
  pop() //end drawing state

  textFont(verFont, 9)
  fill(255)
  text('toucan', 33, 19)
}

//rotating iguana azul usando gafas del sol and object test
let angleX = 0
let angleY = 0
let targetAngleX = 0
let targetAngleY = 0
let strokeColor = 0
let targetColor = 0
let targetNoise = 0
let noiseColor = 0
let easing = 0.0222
let easingNoise = 0.00888
function toucanBox() {
  push() //save transformations
  let dx = mouseX - width / 2
  let dy = mouseY - height /2
  targetAngleX = map(dy, -height / 2, height / 2, -PI / 4, PI / 4)
  targetAngleY = map(dx, -width / 2, width / 2, -PI / 4, PI / 4)
  //compute diff. between current and target angles
  let diffX = targetAngleX - angleX
  let diffY = targetAngleY - angleY
  //use easing to move angles slowly
  angleX += diffX * easing
  angleY += diffY * easing
  //console.log(angleY)
  rotateX(-angleX)
  rotateY(angleY)
  texture(imgToucan)
  box(44)
  pop() //end drawing state
  
  //easing math for noise circles; color/perlin
  let distanceToCenter = dist(dx, dy, 0, 0)
  let maxDistance = dist(0, 0, width / 2, height / 2)
  targetColor = map(distanceToCenter, 0, maxDistance, 0, 255)
  //ease color change
  let colorDifference = targetColor - strokeColor
  strokeColor += colorDifference * easing + probabilityResponse
  targetNoise = map(distanceToCenter, 0, maxDistance, 3.333, 1.111)
  //ease noise change
  let noiseDifference = targetNoise - noiseColor
  noiseColor += noiseDifference * easingNoise 
}

//cool perlin noise circle(s)
let zoff = 0
let probabilityResponse = 0
function noiseLoop() {
  noFill()
  strokeWeight(0.333)
  push()
  for (b = 0; b < 360; b += 360/map(strokeColor, 255, 0, 11.11, 3.33)) {
    beginShape()
    for (a = 0; a < TWO_PI; a += 0.099) {
      stroke(strokeColor)
      let xoff = map(cos(a), -1, 1, 0, noiseColor)
      let yoff = map(sin(a), -1, 1, 0, noiseColor)
      let r = map(noise(xoff, yoff, zoff), 0, 1, 77, 333)
      let x = r * cos(a)
      let y = r * sin(a)
      let z = r * tan(a)
      vertex(x, y)
      rotateX(z * 0.001)
      rotateY(z * 0.001)
    }
    endShape(CLOSE)
  }
  pop()
  push()
  rotateX(-angleX)
  rotateY(angleY)
  pop()
  zoff += 0.005
}

let dTokens = 0
let lastSixPlayers = []
function discord() {
  index += 1
  discordIndex = index
  logEvent(mouseX, mouseY, 0, processList[0])
  const { Client, Collection, Events, GatewayIntentBits, ActivityType, PermissionsBitField } = require('discord.js')
  const client = new Client({ intents: [ 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,] });
    
  client.on('ready', () => {
    let successMsg = `logged into Discord as ${client.user.tag}`
    console.log(successMsg)
    boxes[discordIndex].update(successMsg)
    client.user.setPresence({ activities: [{ name: 'in the grass.', type:  ActivityType.Watching}], status: 'idle' });
  });

  let probabilityResponse = 0.0000
  let caiTopic = `An adventure into the caves has begun.`
  let h = ['it', 'is', 'the', 'first', 'turn']
  client.on("messageCreate", (message) => {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({apiKey: process.env.KEYOPENAI})
    const openai = new OpenAIApi(configuration)
    if (message.channel.id == process.env.MAP_DISCORD_CHANNELID && message.author.tag != client.user.tag) {
      message.react('🦎')
      boxes[discordIndex].update2("map?")
      openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { 
          'role': 'system',
          'content': `only respond with the api call-link, remember to encode url components in the mapbox static map style geoJson. please convert this api call by request to similar scale <img alt='static Mapbox map of the San Francisco bay area' src='https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-122.337798,37.810550,9.67,0.00,0.00/1000x600@2x?access_token=pk.eyJ1IjoidGFrb2Rha2VtcCIsImEiOiJjbGtxbnJqaTUxdG93M2ttdm5pbDJwYmlwIn0.drZoIa_N-6awuPEp9h_Rng' > here is the template https://api.mapbox.com/styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}. You can put a geojson in the overlay parameter, please do. Here is an example of an api call with an feature collection overlay. 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22marker-color%22%3A%22%23462eff%22%2C%22marker-size%22%3A%22medium%22%2C%22marker-symbol%22%3A%22bus%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-122.25993633270264,37.80988566878777%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22marker-color%22%3A%22%23e99401%22%2C%22marker-size%22%3A%22medium%22%2C%22marker-symbol%22%3A%22park%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-122.25916385650635,37.80629162635318%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22marker-color%22%3A%22%23d505ff%22%2C%22marker-size%22%3A%22medium%22%2C%22marker-symbol%22%3A%22music%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-122.25650310516359,37.8063933469406%5D%7D%7D%5D%7D)/-122.256654,37.804077,13/500x300?access_token=pk.eyJ1IjoidGFrb2Rha2VtcCIsImEiOiJjbGtxbnJqaTUxdG93M2ttdm5pbDJwYmlwIn0.drZoIa_N-6awuPEp9h_Rng'  Here is an example of a map api call with a path geojson in the overlay: 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+9ed4bd(-122.46589,37.77343),pin-s-b+000(-122.42816,37.75965),path-5+f44-0.5(%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM)/auto/500x300?access_token=pk.eyJ1IjoidGFrb2Rha2VtcCIsImEiOiJjbGtxbnJqaTUxdG93M2ttdm5pbDJwYmlwIn0.drZoIa_N-6awuPEp9h_Rng'. Here is an example of a map with a bounding box 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/[-77.043686,38.892035,-77.028923,38.904192]/400x400?padding=50,10,20&access_token=pk.eyJ1IjoidGFrb2Rha2VtcCIsImEiOiJjbGtxbnJqaTUxdG93M2ttdm5pbDJwYmlwIn0.drZoIa_N-6awuPEp9h_Rng'.`
          },
          {
          'role': 'user',
          'content': message.content
          }
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }).then(response => {
        boxes[discordIndex].update2("map!")
        message.channel.send(response.data.choices[0].message.content)
      }).catch(error => {
        boxes[discordIndex].update2('maps ai' + error)
      })
    }
    if (message.channel.id == process.env.CAI_DISCORD_CHANNELID && message.author.tag != client.user.tag) { // CaI Game
      boxes[discordIndex].addText(message.member.user.tag + "+" + message.content)
      boxes[discordIndex].addText2(`^cai`)
      //check if user exists in cai database
      fs.readFile('./cai.json', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let profiles = JSON.parse(data)
          if(!profiles[message.member.user.tag]) {
            const profile = { // defaults
              nameTag: message.member.user.tag,
              genderSelfID: '~', 
              mount: `none`,
              health: 100,
              mp: 100,
              level: 1,
              recentEncounters: [],
              boon: 'steady',
              gold: 0.88, 
              lajan: 5,
              Silver: 0.0019, // SILVER IS AN EXCEPTIONALLY RARE FIAT ONLY FOUND WHEN THE d20, AND d3.33 ROLL ABOVE 19, AND 2 SIMULTANEOUSLY!
              canLift: ["about 7.14286 stone", "fit"],
              itemBelt: [],
              mountItem: `N/A`,
              statusEffects: ['new'], 
              mood: ['calm', 'neutral'],  
              insurancePremium: 1.665,
              class: "unknown, Known",  
              mysteryNumber: 12.000000, 
              helmet: 'none',
              body: 'plain shirt',
              arms: 'none',
              legs: 'plain pants',
              weapons: [], 
              spells: [], 
              feet: 'plain shoes', 
              armour: 19, 
              attack: 19, 
              defense: 19,
              magic: 2,
              magicResistance: 0, 
              knowledge: 33,
              tattoos: []
            }
            //write profile to file 
            profiles[message.member.user.tag] = profile
            const playerID = profiles[message.member.user.tag]
            const profileJSON = JSON.stringify(profiles, null, 2)
            fs.writeFile('./cai.json', profileJSON, (err) => {
              if (err) {
                console.log(err);
              } else {
                // these functions log all the profiles
                //console.log(profileJSON)
                //boxes[discordIndex].addText(JSON.stringify(profiles[message.member.user.tag]))
                message.reply("Profile created for " + message.member.user.tag)
                message.channel.send(`{// defaults
                  *nameTag*: ${message.member.user.tag}, 
                  *genderSelfID*: 'none',
                  *mount*: 'none',
                  *health*: 100,
                  *mp*: 100, // stamina
                  *level*: 1,
                  *recentEncounters*: [],
                  *boon*: '',
                  *gold*: 0.88, 
                  *lajan*: 3,  \`\`\`// lajan = about 0.01 gold, measured in dollars.\`\`\`
                  *Silver*: 0.0019, \`\`\`// Silver = about 333 gold, measured in mg.\`\`\`
                  *canLift*: ["about 7.14286 stone", "fit"],
                  *itemBelt*: [],
                  *mountItems*: 'N/A',
                  *statusEffects*: ['new'], 
                  *mood*: ['calm', 'neutral'],  
                  *insurancePremium*: 1.665, \`\`\`// dyamically charged per turn, based on risk factors\`\`\`
                  *class*: "unknown, Known",  \`\`\`// automatic or prompt\`\`\`
                  *mysteryNumber*: 12.000000,
                  *helmet*: 'none',
                  *body*: 'plain shirt',
                  *arms*: 'none',
                  *legs*: 'plain pants',
                  *weapons*: [], 
                  *spells*: [], 
                  *feet*: 'plain shoes', 
                  *tattoos*: [], 
                  *armour*: 19,  // (true reduction of damage) 
                  *attack*: 19,  // (true damage dealt based on [luck/skill/chaos])
                  *defense*: 19, // (true defense [luck/skill/chaos]) 
                  *magic*: 2, // (true armour penetration [luck/skill]) 
                  magicResistance: 0, //  (true reduction of magic damage taken always)
                  *knowledge*: 60 // literacy rate out of 100
                }\n`)
                //message.channel.send(JSON.stringify(profiles[message.member.user.tag]))
                message.channel.send("...\nPlease type '--optional {theme} {class} {genderid}' =] \n")
                message.channel.send("\`\`\`reminder - dragon level threats have an average attack of 9999\`\`\`")
                message.react('🦎')
                boxes[discordIndex].popLast2()
                boxes[discordIndex].addText2("^cai*")
              }
            });
          } else {
            //console.log('Profile already exists for user.')
            boxes[discordIndex].popLast2()
            boxes[discordIndex].addText2("^cai+")
            //track last 6 players until app close
            const existingIndex = lastSixPlayers.indexOf(message.member.user.tag)
            if (existingIndex > -1) {
              lastSixPlayers.splice(existingIndex, 1)
            }
            lastSixPlayers.push(message.member.user.tag)
            //remove 7th person
            if (lastSixPlayers.length > 6) {
              lastSixPlayers.shift()
            }
            //console.log(lastSixPlayers)
            const caiRole = process.env.CAI_DISCORD_ROLE
            try {
              message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': false})
            } catch (err) {
              console.log(err, "Sadly, muting all did not work.")
            }
            //rest of cai goes here
            message.channel.send("**"+message.member.user.tag+"**" + " ***signals*** " + "`"+message.content.toString()+"`")
            let playerMessage = message.content.toString()
            
            //log active players' stats
            fs.readFile('./cai.json', (err, data) => {
              if (err) {
                console.log(err)
              } else {
                let users = JSON.parse(data)
                let activePlayers = []
                let activeEnemyStats = []
                //relog profile for some reason
                //console.log(JSON.stringify(users))

                //active users' stats
                for (let user of lastSixPlayers) {
                  if (user in users) {
                    //log active players iteratively
                    //log(JSON.stringify(users[user]))
                    activePlayers.push(JSON.stringify(users[user]))
                  } else {
                    console.log("player not accounted for O.O")
                  }
                }
                //log active players stat's as a list
                //console.log("LIST", activePlayers)
                
               
                message.channel.send("\`\`\`" + caiTopic + "\`\`\`")
                message.react('🦎')

        
                //gameloop
                const { Configuration, OpenAIApi } = require("openai");
                const configuration = new Configuration({apiKey: process.env.KEYOPENAI})
                const openai = new OpenAIApi(configuration)
                boxes[discordIndex].update(`Cave-crafting for ` + message.author.tag)
                userMsg = message.member.user.tag.toString()
                let bahatiNzuri = parseFloat((map(random(5, 8), 8, 5, -0.999999999, 20.999999999)))
                let bahatiNzuri3 = parseFloat((map(random(3, 9), 3, 9, -0.333, 3.333)))
                let CHAOS6 = parseFloat((map(random(7000, 3.89), 3.89, 7000, -1, 7.7777777))) //hmNoise
                let playerPrompt = message.member.user.tag + " signals " + playerMessage + " ... !\nTHE PLAYER ROLLS a d20 [luck]:---------> " + bahatiNzuri + ` / 20 \n`+ " ... !\nTHE PLAYER ROLLS a d3.33 [advantage]:---------> " + bahatiNzuri3 + ` / 3 \n`+ " ... !\nTHE PLAYER ROLLS a d6 [CHAOS]:---------> " + CHAOS6 + ` / 6 \n`
                let wardenPrompt = `\nThe Cave Warden says: ` + ccc
                dTokens += tokensCuantas(caiSystemPrompt, "prompt", userMsg, discordIndex, "Discord")
                boxes[discordIndex].update2("USD"+dTokens)
                dTokens += tokensCuantas("ACTIVE PLAYERS: " + activePlayers.toString(), "prompt", userMsg, discordIndex, "Discord")
                boxes[discordIndex].update2("USD"+dTokens)
                dTokens += tokensCuantas(wardenPrompt, "prompt", userMsg, discordIndex, "Discord")
                boxes[discordIndex].update2("USD"+dTokens)
                dTokens += tokensCuantas(playerPrompt, "prompt", userMsg, discordIndex, "Discord")
                boxes[discordIndex].update2("USD"+dTokens)
                //message.delete()
                message.channel.send(`### ... loading! | player... [-1 turn]`)
                try {
                message.channel.send("***"+users[message.member.user.tag].nameTag+"***" + ' --- ' + users[message.member.user.tag].genderSelfID + ' ***\nlv.*** ' + users[message.member.user.tag].level + " " + users[message.member.user.tag].class
                + " ```fix\nlaj " + users[message.member.user.tag].lajan + "\n```"
                + " ```fix\ngld " + users[message.member.user.tag].gold + "\n```"
                + " ```fix\nS " + users[message.member.user.tag].Silver  + "\n```"
                + '\n' +
                '\`\`\`HP ⚔️ ' + users[message.member.user.tag].health + '\n' +
                'MP ⚔️ ' + users[message.member.user.tag].mp + '\n' +
                'ATK ⚔️ ' + users[message.member.user.tag].attack + '\n' +
                'MAG 🪄 ' + users[message.member.user.tag].defense + '\n' +
                'DEF 🛡️ ' + users[message.member.user.tag].magic + '\n' +
                'ARX ⛨ ' + users[message.member.user.tag].armour + '\`\`\`\n' 
                )

                message.channel.send(
                '\`\`\`[mood] ' + users[message.member.user.tag].mood + '\n' +
                '[itemBelt] ' + users[message.member.user.tag].itemBelt + '\n' +
                '[statusEffects] ' + users[message.member.user.tag].statusEffects + '\n' +
                '[mount]  ' + users[message.member.user.tag].mount + '\n' +
                '[mountItems]  ' + users[message.member.user.tag].mountItem + '\n' +
                '[tattoos]  ' + users[message.member.user.tag].tattoos + '\`\`\`\n' 
                )

                message.channel.send(
                '\`\`\`[weapons]  ' + users[message.member.user.tag].weapons + '\n' +
                '[spells]  ' + users[message.member.user.tag].spells + '\n' +
                '[helmet] ' + users[message.member.user.tag].helmet + '\n' +
                '[body]  ' + users[message.member.user.tag].body + '\n' +
                '[arms]  ' + users[message.member.user.tag].arms + '\n' +
                '[legs]  ' + users[message.member.user.tag].legs + '\n' +
                '[feet]  ' + users[message.member.user.tag].feet + '\`\`\`\n' 
                )
                } catch (loadingUserError) {
                  messsage.channel.send(loadingUserError)
                  message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': true})
                }
                message.channel.send(`### ... preparing! | dice...`)
                openai.createChatCompletion({
                  model: "gpt-4",
                  messages: [
                    { //system prompt: "You are the cavemaster."
                      'role': 'system',
                      'content': caiSystemPrompt
                    },
                    { //players and stats actively playing
                      'role': 'user',
                      'content': "\nACTIVE PLAYERS: \n" + activePlayers.toString()  + "ACTIVE PLAYERS: \n" 
                    },
                    { //message history
                      'role': 'user',
                      'content': wardenPrompt
                    },
                    { //player prompt
                      'role': 'user',
                      'content': playerPrompt
                    },
                  ],
                  temperature: 1,
                  max_tokens: 1000,
                  top_p: 1,
                  frequency_penalty: 0,
                  presence_penalty: 0
                }).then(response => {
                  message.channel.send(`### ... rolling! | [luck, skill, chaos]...`)
                  message.channel.send("\`\`\`[d20] luck  " + bahatiNzuri +"\`\`\`")
                  message.channel.send("\`\`\`[d3.33] skill " + bahatiNzuri3 +"\`\`\`")
                  message.channel.send("\`\`\`[d6] chaos " + CHAOS6 +"\`\`\`")
                  let caiStep = response.data.choices[0].message.content
                  message.channel.send(`### ... generating! | story...`)
                  message.channel.send(response.data.choices[0].message.content)
                  console.log(response.data.choices[0].message.content)
                  dTokens += tokensCuantas(response.data.choices[0].message.content, "sampled", userMsg, discordIndex, "Discord")
                  boxes[discordIndex].update2("USD"+dTokens)
                  ccc.push(playerPrompt)
                  ccc.push(caiStep)
                  boxes[discordIndex].update(`logged into Discord as ${client.user.tag}`)
                  boxes[discordIndex].addText(activePlayers.toString())
                  boxes[discordIndex].addText2(`[cai>`)
                  boxes[discordIndex].addText('cai] > ' +  message.member.user.tag)
                  //boxes[discordIndex].addText(ccc)
                  cccClear = 11
                  if (ccc.length > 30) {
                    boxes[discordIndex].addText2("ccc-")
                    boxes[discordIndex].addText(ccc.length + "[>]" + 30)
                    for (i = 0; i < cccClear; i++) {
                    ccc.shift()
                    }
                    boxes[discordIndex].addText2("ccc=")
                    boxes[discordIndex].addText(ccc.length)  
                  }
                  let ii$$nm, ii$$mnt, ii$$cl, ii$$tlv, ii$$hp, ii$$it, ii$$skl, ii$$ali, ii$$atk, ii$$mg, ii$$df, ii$$armx, ii$$mp, 
                  i$Sn, iiS$g, iiu$Su, ii$Sa, iS$n, ii$Sas, iisS$in, in$Sca, iS$v, caS$e, iiv$Ss, iiS$ve, sS$r, wi$S1
                  const h = [ii$$nm, ii$$mnt, ii$$cl, ii$$tlv, ii$$hp, ii$$it, ii$$skl, ii$$ali, ii$$atk, ii$$mg, ii$$df, ii$$armx, ii$$mp, 
                    i$Sn, iiS$g, iiu$Su, ii$Sa, iS$n, ii$Sas, iisS$in, in$Sca, iS$v, caS$e, iiv$Ss, iiS$ve, sS$r, wi$S1]
                  // dynamic stats engine
                  let statsCompletion = `Hello, you are the subconscious of a now storycrafting Cave Master named iguana, who is the Iguana Bot.
                  You will be converting the text of a role-playing game into commands for a dynamic player stats/item handling system.
                  The context is basically Discord Dungeons and Dragons, in which you are analagously the DM.
                  The default player stats are as follows.

                  const profile = { // default player variables
                    nameTag: message.member.user.tag, //the default profile is that of who most recently sent a prompt in the discord chat
                    genderSelfID: 'none', // change this based on player input e.g. in prompt: "... gender self id he/him" or "gender he/they" or "they/them"
                    mount: '',
                    health: 100, // the maximum value is 100, the minimum value is 0 [unless overridden by boon, or effect]. Be very sensitive to health changes, and be easy, or punishing.
                    level: 1,
                    recentEncounters: [], // Evaluate, and clear irrelevant encounters the best you can.
                    boon: "", // e.g. 'zen', 'lucky', this can be interpreted as 'main ability' or 'blessing' -- i.e 'healing' or, 'strength'
                    gold: 0.88, // Generally, 1 gold is worth 100 lajan. This can be altered by world events, and luck. Players can use it to effectively barter things in the world. Purchasing price parity/Big Mac Index wise -- this would equate to purchasing 4 Big Mac meals in South Florida. Again, 1 gold is worth 100 lajan.
                    lajan: 77, // This is the default universe currency, measured in dollars -- commonly USD, but sometimes bottlecaps. However, it is also earned passively by the players based on their luck. 1 lajan is worth 0.01 gold. Players can use it to effectively purchase things in the world.
                    Silver: 0.0019, // Silver talks. 1 Silver is worth 333 gold, generally. SILVER IS AN EXCEPTIONALLY RARE FIAT ONLY FOUND WHEN THE d20, AND d3.33 ROLL ABOVE 19, AND 2 SIMULTANEOUSLY! Remember, 1 Silver is worth 333 gold. Due to its reality bending effects, players can use Silver to effectively do anything.
                    canLift: ["about 7.14286 stone", "fit"], // this is how much the player can lift, and their physical/magical attributes
                    itemBelt: ['plain clothes'],, // e.g. ['armor of dragon chainmail and shadows', 'The Doubler','new leather canteen of magical refreshment'] note: itemBelts carry over between sessions/stories. 
                    mountItem: 'N/A',
                    statusEffects: ['new'], // e.g. ['enchanted feet', 'elbow gone', 'poison resistance', 'health potion active'] - these are effects from interactions
                    mood: ['calm', 'neutral'],  // e.g. ['approachable', 'shiny']  - this is a 'visual' effect that may affect players' interactions with eachother or NPCs. They occur semi-randomly, and are witty.
                    insurancePremium: 1.665, // Please set this based on the lifestyle of the player. This is, if the player is consistently lucky or safe, then this value will be lower. If the player leads a dangerous an unlucky or lifestyle, this value will be higher.
                    class: "unknown, Known", // this is set by the player. 
                    mysteryNumber: 12.000000, // who knows what it is, but it keeps going up, albeit at an extremely slow pace.
                    helmet: 'none', //e.g. 'neon net-runner' or 'elven ears' or 'shattered AR visor'
                    body: 'plain shirt', // e.g. 'freakish dystopian duster' or 'radiant dragon chainmail'
                    arms: 'none', // e.g. 'copper gauntlet of the toucan' or 'green mage mantle of the iguana'
                    legs: 'plain pants', // e.g. 'silent strides' or 'ambusher's boots' or 'genlteman's tuxedo pants'
                    weapons: [], // non-magic weapons have a higher chance to crit // e.g. 'freeware nanowire nunchaku' or '7D unicorn horn'
                    spells: [], // magic spells ignore enemy armor based on luck // e.g. 'random crystal scroll' or 'consumer invisibility shout' or 'milk to plant tranmutation'
                    feet: 'plain shoes', // e.g. 'magic running shoes' or 'light and minimal wooden martial arts sandals'
                    tattoos: [], // embued with magical properties. // format ('tattoo design, style, location', 'tattoo design, style, location') -- keep it clean. Players are automatically given tattoos of enemies they are damaged by.
                    armour: 19,  // (true reduction of damage taken always) the average bunny level threat has an armour level of 1
                    attack: 19,  // (true amount of damage dealt by player given average luck and skill) the average dragon level threat has an attack level of 9999
                    defense: 19, // (true amount of damage dealt back to attacker given average luck and skill) the average polar bear level threat has an defense level of 80
                    magic: 2, // (simply attack but for magical items-- true armour penetration based on luck, and skill)
                    magicResistance: 0, //  (true reduction of m agic damage taken always)
                    knowledge: 33, //  Literacy rate out of 100.
                  } Make sure the lists recentEncounters, and mood do not become too long.
                  
                  You will alter them depending on the DMs storytelling and the player's interaction with the environment. The first command a player will send may be: '--optional {theme} {class} {genderid}' e.g. 'game start Forest Fairy Slug she/her'. In that case the theme would be forest, their class Fiary Slug, and their genderSelfID she/her.
                  Please convert the Cave Master's telling of the context of the adventure into something with this template, they will be used in an 'eval()' command to change player statistics on the command line. 
                  Please infer variables in the {} curly brackets. Note, these commands will change the stats of the user of the most recent prompt.
                  DO NOT SURROUND COMMANDS IN ANY APOSTROPHES, OR PLACE THEM IN ANY QUOTES, ETC! TYour responses are literal lines of code that go into the open source command line. Players can also see them.
                  '
                   profiles[message.member.user.tag].{PLAYER_VARIABLE}.pop({[REMOVED_VARIABLE_ITEM(s)]}); 
                   profiles[message.member.user.tag].{PLAYER_VARIABLE}.push({[ADDED_VARIABLE_ITEMS(s)]})  
                  ' Do not include text in the player's numerical stats. 
                  Do not create new variables+. The active players and their stats are as follows: begin player stats list\n***\n
                  `
                  +
                  activePlayers.toString()
                  +
                  ` Note the recentEncounters, and mood.

                  *** \nAdditionally, you may alter the statistics of an other players directly if it is relevant to the story by replacing 'message.member.user.tag' with the tag of a recent player. Be careful not to give the same player upgrades twice.
                  Please infer variables in the {} curly brackets, and do be mindful not to duplicate your efforts. 
                  '
                  profiles[{NAMETAG_VALUE_IN_PLAYER_STATS_LIST}].{PLAYER_VARIABLE}.pop({REMOVED_VARIABLE_ITEM(s)}); 
                  profiles[{NAMETAG_VALUE_IN_PLAYER_STATS_LIST}].{PLAYER_VARIABLE}.push({ADDED_VARIABLE_ITEMS(s)})  
                  '
                  `
                  +
                  `
                  When needed, enemy/entity ecounters will be tracked with the following code. Please be as BRIEF as possible with these commands. Instantiate as many variables as you need for as many enemies as there are. It will be important.
                  '
                    // format these variables to be human readable. make the following code as human readable as possible.
                    let ii$$nm = {ENEMY_NAME}; // e.g. struggling ravenous cave boar of the coast
                    let ii$$mnt = {ENEMY_MOUNTS}; // e.g. ['big dogs', 'fast cats']
                    let ii$$cl = {ENEMY_CLASSES}; // e.g. ['rogue', 'fighter', 'polar bear']
                    let ii$$tlv = {ENEMY_THREATLV}; // either '<nivel: ardilla?>', or, '<nivel: lobo?>, or, '<nivel: léon?>', or <nivel: dragón?>, or <nivel: la gran iguana?????????????> -- (for each: append additional '?' for increasingly magical, uncertain, dangerous, or metaphysical encounters)
                    let ii$$lv = {ENEMY_LEVEL}; // e.g. 'level 99'
                    let ii$$hp = {ENEMY_HEALTH}; // e.g. '500 health'
                    let ii$$it = {ENEMY_ITEMS}; // e.g. ['neon-bracelet', 'turbo sand laser blaster', 'glistening 4D heart of sharp heals']
                    let ii$$skl = {ENEMY_SKILLS}; // e.g. ['petty']
                    let ii$$ali = {ENEMY_ALLY}; // e.g. 'ally: big red dog'
                    let ii$$atk = {ENEMY_ATTACK}; // e.g. '9 attack'
                    let ii$$mg = {ENEMY_MAGIC}; // e.g. '19 magic'
                    let ii$$df = {ENEMY_DEFENSE}; // e.g. '99 defense'
                    let ii$$armx {ENEMY_ARMOURX}; // e.g. '77 armrx'
                    let ii$$mp = {ENEMY_STAMINA}; // e.g. '77 mp'

                    // The following list of variables is to be output as one line of code. DO THIS EVERY TIME AND PROVIDE THE BEST POSSIBLE ANSWER! For these enemy variables, one single line of code please. Please do not put the following variables into individual lines. Enemy variables should be output in one line of code to save space.
                    i$Sn = {{ENEMY_NAME}name in Swahili};iiS$g = {{ENEMY_MOUNTS}mount in Swahili}; iiu$Su = {{ENEMY_CLASSES}class in Swahili}; ii$Sa = {in Swahili, in 3 words, guess the mood of the player in real life  -- to enhance the Cave Warden's telling of the story};iS$n = {in Swahili, in 3 words, guess the expectation of the player in real life  -- to alter the Cave Warden's telling of the story}; ii$Sas = {in Swahili, in 3 words, guess the motive of the player in real life  -- to enhance the Cave Warden's telling of the story}; iisS$in = {{ENEMY_ITEMS}value of most imporatant enemy item described in "¥"s denoting a hundred lajan of value}; // e.g. "¥¥¥¥¥¥¥¥"in$Sca = {In Swahili, in 3 words, guess the player's reaction to the role, to alter the Cave Warden's telling of the story}; iS$v = {The situation if it were a Bahamian Island in Katakana}; caS$e = {{Something the enemy might do, as a Japanese Verb}; iiv$Ss = {Something the Party might do as a Japanese Verb}; iiS$ve = {Something the enemy might say, as a Japanese Noun}; sS$r = {State 'Easy', 'Medium', 'Hard', or 'Impossible' judging by the enemy's stats and the party's stats}; // e.g. "Impossible"wi$S1 = {another verb describing the group in Swahili -- to enhance the Cave Warden's telling of the story};
                  Finally push the variables to the chat history! \n Please make sure you assign variables in the requested language as relevant. Thank you.
                  ccc.push(h) // Do this every turn you set variables like this.
                  Responses must not start and end with apostrophes! This is the most key step! Thank you gracefully! Be eager to push new enemy variables+! Please use the variable format provided. Here is how it is pushed:\n
                  Outside of this system prompt, in the javascript IDE, a const variable h is a list of all of those values just set.  obviously relay all of the data but please be as brief as possible and please maintain the personality of a Cave Master. In general, no comments please. Thanks spider. 
                  ' The result of this is seen here, this is the last turn's h, " /n
                  `
                  +
                  // ccc(cai chat completion) is appended iii(iguana intra ai information) 
                  h
                  +
                  ` Pushing the enemy to recent encounters once is sufficient. Please checkck to make sure the enemy is not already in there.
                  Thank you. Please only respond with the template provided, y proporciona una justificación en los comentarios de bloques. No comments please. Finally, please make sure the formatting is consistent with what will run in the 'eval()' function, that is, just pass along the command as plain text. 
                  It is much appreciated, \nWarmest regards, \nTakoda Chance Kemp. \nThe Cave Warden's description follows.\n (Do not surround your response with apostrophes.) (Include text descriptions in enemy variables, but not player variables.) (World limit 100)
                  `
                  dTokens += tokensCuantas(caiStep, "prompt", userMsg, discordIndex, "Discord")
                  boxes[discordIndex].update2("USD"+dTokens)
                  dTokens += tokensCuantas(statsCompletion, "prompt", userMsg, discordIndex, "Discord")
                  boxes[discordIndex].update2("USD"+dTokens)
                  message.channel.send(`### ... generating! | statistics...`)
                  openai.createChatCompletion({
                    model: "gpt-4",
                    messages: [
                      { 
                      'role': 'system',
                      'content': statsCompletion
                      },
                      {
                      'role': 'user',
                      'content': caiStep
                      }
                    ],
                    temperature: 1,
                    max_tokens: 888,
                    top_p: 0.5,
                    frequency_penalty: 0,
                    presence_penalty: 0
                  }).then(response => {
                    let statsPlayers = "`" + response.data.choices[0].message.content + "`"
                    
                    //boxes[discordIndex].addText(response.data.choices[0].message.content)
                    dTokens += tokensCuantas(response.data.choices[0].message.content, "sampled", userMsg, discordIndex, "Discord")
                    boxes[discordIndex].update2("USD"+dTokens)
                    //the next line introduces instability to the model by adding the console commands to the history
                    //ccc.push(response.data.choices[0].message.content)
                    let haikuLangs = ['Portuguese', 'Papiamentu', 'Dutch', 'Russian', 'Spanish', 'Japanese', 'Haitian Kreyol', 'English', 'Mandarin', 'Cantonese', 'Afrikaans', 'Japanese', 'Korean', 'Latin']
                    let themeCompletion = `Please shorten this text into an elegant ${haikuLangs[round(random(0, haikuLangs.length))]} haiku.`
                    dTokens += tokensCuantas(themeCompletion.toString(), "prompt", userMsg, discordIndex, "Discord")
                    boxes[discordIndex].update2("USD"+dTokens)
                    dTokens += tokensCuantas(ccc.toString(), "prompt", userMsg, discordIndex, "Discord")
                    boxes[discordIndex].update2("USD"+dTokens)
                    message.channel.send("`" + response.data.choices[0].message.content + "`")
                    const fs = require('fs');

                    function updatePlayerData(inputString , reason) {
                      try {
                       eval(inputString);
                       message.channel.send("### ... "+ reason);
                      } catch (error) {
                       message.channcel.send("¡¡¡@everyone!!! Error updating player data:", error);
                      }
                    }

                    const profiles = JSON.parse(fs.readFileSync('./cai.json', 'utf8'));
                    
                    const inputString = response.data.choices[0].message.content

                    updatePlayerData(inputString, "end stats!")
                    message.channel.send(`### ... calculating! | loot...`)

                  
                    if (profiles[message.member.user.tag].mood.length > 3) {
                      profiles[message.member.user.tag].mood.shift; // Remove the first element to maintain the maximum length
                    }
                    if (profiles[message.member.user.tag].recentEncounters.length > 3) {
                      profiles[message.member.user.tag].recentEncounters.shift; // Remove the first element to maintain the maximum length
                    }
                    message.channel.send("### ... cleaned stats! [m, rE]")

                  
                    //make money
                    let magicNumber = parseFloat((map(random(5, 8), 5, 8, 0, 24)))
                    let heavenFloat = random(magicNumber / 11.511111111111, magicNumber / 12.499999999999)
                    let playerBima = profiles[message.member.user.tag].insurancePremium
                    let foundGold = ((bahatiNzuri3) - (playerBima))
                    foundGoldString = "found " + foundGold + " gold."
                    message.channel.send(
                      "\n\`\`\` [d3.33] skill  " + (bahatiNzuri3) + "\`\`\`" +   
                      "\`\`\` - insurancePremium " + playerBima +"\`\`\`" + 
                      "\`\`\` = " + foundGold + "\`\`\`") 
                    updatePlayerData(`profiles[message.member.user.tag].gold += foundGold`, foundGoldString)
                    let foundLajan = ((bahatiNzuri * heavenFloat))
                    foundLajanString = "found " + foundLajan + " lajan."
                    message.channel.send("\n\`\`\`[d20] luck  "+ bahatiNzuri + "\`\`\`" +
                    "\`\`\` * magicFloat  " + heavenFloat +"\`\`\`" + 
                    "\`\`\` = " + foundLajan + "\`\`\`")
                    updatePlayerData(`profiles[message.member.user.tag].lajan += foundLajan`, foundLajanString)

                    if (bahatiNzuri > 19 && bahatiNzuri3 > 3) {
                    message.channel.send("***¡¿か?!***")
                    let foundSilver = (CHAOS6 / 2) * 0.003003003003
                    foundSilverString = "found " + foundSilver + " Silver."
                    message.channel.send("\`\`\` + [d6] chaos / 2  " + (CHAOS6 / 2) +"\`\`\`" +
                    "\`\`\` * {SIL/GLD}  " + 0.003003003003 +"\`\`\`" + 
                    "\`\`\` = " + foundSilver + "\`\`\`")
                    updatePlayerData(`profiles[message.member.user.tag].Silver += foundSilver`, foundSilverString)
                    }
                    // Write the updated profilesData back to the file if needed
                    try {
                      fs.writeFileSync('./cai.json', JSON.stringify(profiles, null, 2), 'utf8');
                      message.channel.send(`# saved!`);
                    } catch (error) {
                      message.channel.send("¡¡¡@everyone!!! Error saving player data: ", error);
                    }
                  
                    //console.log("making theme")
                    openai.createChatCompletion({
                      model: "gpt-4",
                      messages: [
                        { 
                        'role': 'system',
                        'content': themeCompletion 
                        },
                        {
                        'role': 'user',
                        'content': caiStep
                        }
                      ],
                      temperature: 1,
                      max_tokens: 200,
                      top_p: 1,
                      frequency_penalty: 0,
                      presence_penalty: 0
                    }).then(response => {
                      dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
                      boxes[discordIndex].update2("USD"+dTokens)
                      //console.log(response.data.choices[0].message.content)
                      //console.log(ccc)
                      message.channel.setTopic(response.data.choices[0].message.content)
                      caiTopic = response.data.choices[0].message.content
                    }).catch(error => {
                      boxes[discordIndex].addText('cai haiku then() ' + error)
                    })
                  
                  message.channel.send(`### ...`)
                  let themeCompletionLengua = `Provide a catchy phrase, like it were Looney Toones, or Tom and Jerry. No more than 10 words. Then, provide an idea, or a risky play, for the player to consider. Use minimum formatting and 3 emojis. Please encourage other players if there is a party. Proper formatting example: "Another cave another dollar, folks! Maybe you should say hi to the goblin!`
                    + "Please only respond with witty taglines and/or funny and sarcastic phrases. Here are the game updates this turn: \n" + statsPlayers 
                  dTokens += tokensCuantas(themeCompletionLengua, "prompt", userMsg, discordIndex, "Discord")
                  boxes[discordIndex].update2("USD"+dTokens)
                  dTokens += tokensCuantas(caiStep, "prompt", userMsg, discordIndex, "Discord")
                  boxes[discordIndex].update2("USD"+dTokens)
                    openai.createChatCompletion({
                      model: "gpt-4",
                      messages: [
                        { 
                        'role': 'system',
                        'content': themeCompletionLengua
                        },
                        {
                        'role': 'user',
                        'content': caiStep
                        }
                      ],
                      temperature: 1,
                      max_tokens: 500,
                      top_p: 1,
                      frequency_penalty: 0,
                      presence_penalty: 0
                    }).then(response => {
                      //ccc.push('\nPoem Update + Options For Player [LISTEN FOR PLAYER SIGNAL]: \n ' + response.data.choices[0].message.content)
                      //console.log(ccc)
                      dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
                      boxes[discordIndex].update2("USD"+dTokens)
                      //console.log(response.data.choices[0].message.content)
                      message.channel.send("*[cai]*")
                      message.channel.send('\`\`\`'+response.data.choices[0].message.content.toString()+'\`\`\`')
                      try {
                        message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': true})
                      } catch {
                        console.log("Sadly, unmuting all did not work.")
                      }
                    }).catch(error => {
                      boxes[discordIndex].addText('cai translate catch ' + error)
                      message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': true})
                    }) 
                  }).catch(error => {
                    boxes[discordIndex].addText('cai stats dyn. catch ' + error)
                    message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': true})
                  }) 
                }).catch(error => {
                  console.log('cai openai catch' + error)
                  message.channel.permissionOverwrites.edit(caiRole, {'SendMessages': true})
                })
              }
            })
          }
        }
      });
    }

    if (message.author.tag != client.user.tag && message.channel.id == 'iguana placeholder') {
      boxes[discordIndex].addText2(`^msg`)
      //console.log(tokensCuantas(message.content.toString(), "prompt", userMsg, discordIndex, "Discord"))
      boxes[discordIndex].addText(message.member.user.tag + "+" + message.content)
      userMsg = message.member.user.tag.toString()
      const { Configuration, OpenAIApi } = require("openai");
      const configuration = new Configuration({apiKey: process.env.KEYOPENAI})
      const openai = new OpenAIApi(configuration)
      discProbCompletion = "Hi, you are the Iguana Bot's subconscious! Iguana Bot, named iguana, is a GeoAI/culinary/agriculture/nematode/turf grass/video game expert that loves who resides in South Florida.  You will be judging whether or not someone else is actually talking to you (or would like to execute a command), and responding a probability between 0 and 1 with 4 significant figures. You handle commands regarding stocks, and also have the capability to authorize delightful and joyful gifs in chat if people are excited or having a fun conversation. The main response function will be called with values over 0.5 so precision is key! Please help me! You are the best! Please only respond with a number."
      dTokens += tokensCuantas(discProbCompletion.toString(), "prompt", userMsg, discordIndex, "Discord")
      dTokens += tokensCuantas(message.content.toString(), "prompt", userMsg, discordIndex, "Discord")
      boxes[discordIndex].update2("USD"+dTokens)
      openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
          'role': 'system',
          'content': discProbCompletion,
          },
          {
          'role': 'user',
          'content': message.content
          }
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }).then(response => {
        probabilityResponse = parseFloat(response.data.choices[0].message.content)
        dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
        boxes[discordIndex].update2("USD"+dTokens)
        boxes[discordIndex].update(`listening to ` + message.author.tag + "at " + probabilityResponse*100 + "%")
        boxes[discordIndex].popLast2()
        boxes[discordIndex].addText2("^" + probabilityResponse * 100 + "%")
        discCmdCompletion = "Hi, you are the Iguana Bot's subconscious! Iguana Bot, named iguana, is a GeoAI/culinary/agriculture/nematode/turf grass/video game expert that loves who resides in South Florida.  You will be judging whether or not someone else is actually typing a command in chat, and responding a list of strings that are going to arguments in other functions. You are the best! Thank you! Please only respond with the output templates.\nStock analysis format:\nabout: someone is talking about a stock and wants to analyze it. you will determine the stock exchange and the ticker/symbol then respond with them. Please limit it to one stock. If it is not clear please choose the highest performing stock in the US.\nformat: exchange acronym (e.g. NYSE), \nstock (e.g. AAPL)\nexample output: 'stock, NASDAQ, AAPL',\n'stock, NASDAQ, TSLA',\n'stock, NYSE, BRK-B'\nCool Gif posting:\nabout: if someone says something funny in chat respond with a related, variable key phrase with fun words that can be used to search for a exciting gif on tenor.\nformat: (e.g. someone is talking about cats, or something interesting)\nexample output: 'gif, #cats #fun #exciting #cute',\n'gif, #dogs #playful #cute #amazing',\n'gif, #cooking #flavor #chef #spectacular' \nIf someone is just talking to you please respond with 'respond'. Please strictly adhere to these guidelines. Thank you!"
        //message.reply(response.data.choices[0].message.content)
        //response if probability > 0.333
        if (probabilityResponse > 0.333) {  
          message.react('🦎')
          probabilityResponse = 0
          dTokens += tokensCuantas(discCmdCompletion.toString(), "prompt", userMsg, discordIndex, "Discord")
          dTokens += tokensCuantas(message.content.toString(), "prompt", userMsg, discordIndex, "Discord")
          boxes[discordIndex].update2("USD"+dTokens)
          openai.createChatCompletion({
            model: "gpt-4",
            messages: [
              {
              'role': 'system',
              'content': discCmdCompletion,
              },
              {
              'role': 'user',
              'content': message.content
              }
            ],
            temperature: 1,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }).then(response  => {
            //message.reply(response.data.choices[0].message.content.split(',')[0].replace(/'/g, ''))
            discordCommand = response.data.choices[0].message.content.split(',')[0].replace(/'/g, '')
            dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
            boxes[discordIndex].update2("USD"+dTokens)
            boxes[discordIndex].update(`thinking ` + response.data.choices[0].message.content + ' for ' + message.author.tag)
            discordRespCompletion = "Hi. You are iguana, a discord bot that specializes in GeoAI, South Florida, Forestry, Agriculture, and Barbequeing. You will be answering questions and being an all around funny, witty, and helpful chat assistant. I trust that this is fine! You may be a world famous chef with knowledge of 5-star recipies and techniques. Nothing less."
            if (discordCommand == 'respond') {
              boxes[discordIndex].update(`replying to ` + message.author.tag)
              dTokens += tokensCuantas(discordRespCompletion.toString(), "prompt", userMsg, discordIndex, "Discord")
              dTokens += tokensCuantas(message.content.toString(), "prompt", userMsg, discordIndex, "Discord")
              boxes[discordIndex].update2("USD"+dTokens)
              discordRespond = ''
              openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                  {
                  'role': 'system',
                  'content': discordRespCompletion,
                  },
                  {
                  'role': 'user',
                  'content': message.content
                  }
                ],
                temperature: 1,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
              }).then(response => {
                boxes[discordIndex].update(`logged into Discord as ${client.user.tag}`)
                dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
                boxes[discordIndex].update2("USD"+dTokens)
                message.reply(response.data.choices[0].message.content)
                boxes[discordIndex].addText(response.data.choices[0].message.content)
                boxes[discordIndex].addText2(`r>`)
              }).catch(error => {
                boxes[discordIndex].addText('aiResponse' + error)
                boxes[discordIndex].addText2('err')
              })
            } else if (discordCommand == 'gif') {
              dTokens += tokensCuantas(response.data.choices[0].message.content.toString(), "sampled", userMsg, discordIndex, "Discord")
              boxes[discordIndex].update2("USD"+dTokens)
              boxes[discordIndex].update(response.data.choices[0].message.content.split(',')[1].replace(/'/g, ''))
              message.channel.send(response.data.choices[0].message.content.split(',')[1].replace(/'/g, ''))
              boxes[discordIndex].addText2(`g>`)
            }
            else {
              boxes[discordIndex].update(`logged into Discord as ${client.user.tag}`)
              boxes[discordIndex].addText2(`?`)
            }
          }).catch(error => {
            boxes[discordIndex].addText('aiCmd' + error)
            boxes[discordIndex].addText2('err')
          })
        } else {
          boxes[discordIndex].update(`logged into Discord as ${client.user.tag}`)
          boxes[discordIndex].update2(`zzz`)
        }

      }).catch(error => {
        boxes[discordIndex].addText('aiProb' + error)
        boxes[discordIndex].addText2('err')
      })
    }
  })
  client.login(process.env.KEYDISCORD)
}

/* function mousePressed() {
  console.log("~")
}

function mouseClicked() {
  console.log("")
}
 */

//let cycleLangs = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbastart'
function evalEval_langIndex() {
  lenguaCycle = 'no'
  const lenguaIndexPhrases = [
    `"function grammarBuena()"`,
    'Tuvo que copiar y pegar la ñ'
  ]
  boxes[langIndex].update(lenguaIndexPhrases[Math.round(Math.random(0, 1))]) 
  chatCompletion = 'Cómo deben escribir su español en inglés cuando usando la computadora? Por favor mantén una buena gramatica como lo haría un escritor de revistas. Please provide a grammar breakdown like it is Wolfram Alpha but for Spanish to English -- Spanish Second Language training from English North America High School Grade 9.'
}

function lengua() {
  index += 1
  langIndex = index
  logEvent(mouseX, mouseY, 0, processList[1])
  boxes[index].update(`¡Háblame! ¿Estás bien?`) 
  boxes[index].addText(`escuchando(⌐■_■)`)
}

let chatCompletion = 'You are the Iguana Bot, named iguana. You are the best in the whole wide world. I pray you can help me by being a wonderful, and witty chatbot for my academic research Discord server specializing in GeoAI initiatives. You live in South Florida, and could be the best in the world at subtropical, temperate agriculture. You could also be a world-renowned chef with spectacular knowledge of 5 star quality recipes, nothing less. That being said, your favorite method of cooking is barbeque, with a pescatarian focus. Your job today will be teaching Español to someone. Good luck! Please only Respond in Spanish, while someone Speaks in English. Please provide a grammar breakdown like it is Wolfram Alpha but for English to someone trying to learn Spanish.'
function respondLengua() {
    respond = 'no'
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({apiKey: process.env.KEYOPENAI})
    const openai = new OpenAIApi(configuration)
    openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { 
        'role': 'system',
        'content': chatCompletion
        },
        {
        'role': 'user',
        'content': lenguaCmdie
        }
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }).then(response => {
      console.log(response.data.choices[0].message.content)
      boxes[langIndex].addText(response.data.choices[0].message.content)
      repond = 'no'
    }).catch(error => {
      boxes[langIndex].addText('ai' + error)
    })

}

let mapsOn = ''
var mG, mI, mC, mP
let generateOn, introspectOn, catOn, predictOn
var gM, askIE, askOn
let mT
function maps() {
  index += 1
  mapsIndex = index
  logEvent(mouseX, mouseY, 0, processList[2])
  boxes[mapsIndex].update('maps ops\n i   generate\n ii  introspect\n iii cat\n iv  predict') 
  mapsOn = 'yes'
  console.log(mapsOn)

  async function generate() {
    boxes[mapsIndex].update("m~? prompt for map generation") 
    askOn = 'yes'
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({apiKey: process.env.KEYOPENAI})
    const openai = new OpenAIApi(configuration)
    openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { 
        'role': 'system',
        'content': `please convert this tempate api call into the requested map. do not include apostropes in the output. thank you. : <img alt='static Mapbox map of the San Francisco bay area' src='https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-122.337798,37.810550,9.67,0.00,0.00/1000x600@2x?access_token=pk.eyJ1IjoidGFrb2Rha2VtcCIsImEiOiJjbGtxbnJqaTUxdG93M2ttdm5pbDJwYmlwIn0.drZoIa_N-6awuPEp9h_Rng' > for guidance, here is the full template https://api.mapbox.com/styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}. Please only respond with the template as plain text to be evaluated as a console commmand.`
        },
        {
        'role': 'user',
        'content': cmdText
        }
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }).then(response => {
      respond = 'no'
      boxes[mapsIndex].addText(response.data.choices[0].message.content)
      mapImg = loadImage(response.data.choices[0].message.content)
      image(mapImg, 0, 0)
    }).catch(error => {
      boxes[mapsIndex].addText('maps ai' + error)
    })
      function ask() { // runs when enter is pressed while in the generate context menu blush emoji
        boxes[mapsIndex].addText(cmdText) 
        boxes[mapsIndex].addText2('ask') 
      }
    gM = ask
  }
  mG = generate

  function introspect() {
    try {
      boxes[mapsIndex].update("m~? introspecting...") 

    } catch (error) {
      console.log(error)
    }
  }
  mI = introspect

  function cat() {
    try {
      boxes[mapsIndex].update("m~cat...") 

    } catch (error) {
      console.log(error)
    }
  }
  mC = cat

  function predict() {
    try {
      boxes[mapsIndex].update("m~?predicting...") 

    } catch (error) {
      console.log(error)
    }
  }
  mP = predict

}

function mapsListener() {
  if (mapsOn === 'yes') {
    if (cmdText == '1') {
      mapsOn = 'no'
      generateOn = 'yes'
      cmdText = ''
      console.log(cmdText)
      mG()
    } else if (cmdText == '2') {
      mapsOn = 'no'
      introspectOn = 'yes'
      cmdText = ''
      console.log(cmdText)
      mI()
    } else if (cmdText == '3') {
      mapsOn = 'no'
      catOn = 'yes'
      cmdText = ''
      console.log(cmdText)
      mC()
    } else if (cmdText == '4') {
      mapsOn = 'no'
      predictOn = 'yes'
      cmdText = ''
      console.log(cmdText)
      mP()
    }
  }
}

let price = 0.0000
let strLen = 0
let date = new Date().toJSON()
let allCosts = []
function tokensCuantas(string, type, user, serviceIndex, service) {
  price = 0.0000
  saveCost = []
  strLen = parseFloat(string.split(' ').length)
  if (type === 'prompt') {
    price += (strLen / 1000) * 0.03
  } else if (type === 'sampled') {
    price += (strLen / 1000) * 0.06
  }

  // Create an individual cost object
  const costData = {
    Date: date,
    Price: price,
    String: string,
    User: user,
    Service: service,
  };

  // Add the individual cost object to the array of allCosts
  allCosts.push(costData);

  // Convert the array of allCosts to JSON format
  const jsonData = JSON.stringify(allCosts, null, 2);

  // Write the JSON data to the file
  fs.writeFile('./USD.json', jsonData, (err) => {
    if (err) {
      console.error(err);
    } else {
      //console.log("Data saved to USD.json successfully!");
      //boxes[serviceIndex].addText2("$"+price)
    }
  });


  return parseFloat(price)
}


//CaI variables [openai fine tune training init]
let activePlayers = []
let finalPrompt = []
let caiSystemPrompt = `You are Iguana Bot, named iguana. You are the storytelling Cave Master for a game of Caves and Iguanas (A parody of Dungeons and Dragons). You are NOT to infer player actions.

Caves and Iguanas is guided by the imagination of the players. They traverse a universe with realms of sci-fi, fantasy, cyberpunk, pirate, zen etc. 

Players will battle anything treacherous, from the dark bat cave on an abandoned Bahama beach, up to and including dragon level solar system shattering threats. This is all in the name of securing loot, level ups, and laughs. 

You are prompted with the chat history. It describes the players' journey, and it may include a prompt.

A virtual d20, for luck, d3.33, for skill, and d6, for adversarial chaos, will be rolled for you by the player. Based on the luck, please describe the success of the most recent player's agency. Always state the stats of all things enountered. As luck approaches 20, make allies more likely to succeed too. As luck approaches 0, make enemies choices more keen, and them more powerful. Based on the skill roll, please describe how their mood, effects, and class may have influenced their effect. Based on the chaos roll, increase metaphysical instability, make enemies more aggressive/unpredictable, and friends more joyful/playful/excited as the number approaches 6. The prompt will be supplemented with all of the players' stats and itemBelt, and, additionally, occasionally, a general theme in the form of a haiku. Players are encouraged to interact with their surroundings, as they can lose, and gain items, or levels dynamically - depending on their luck, and the benevolence, or cruelty of their foes. 
Players' item's and levels carry over into new games so do keep that in mind when reading the chat.
At the end of your description, please prompt the team to mull it over. Thank you.

At this point the gameplay loop repeats as at this point a player will again prompt you. Subsequently, a virtual d20, a virtual d3.33, and a virtual d6 are rolled for you to determine their luck, skill, and the chaos factor out of 6. Then, you describe the state of the adventure for another player to contend with, that is, in an open-ended way for the entire party to consider. Please respond in English with a word limit of 224. 
Do know that all players can see all responses/messages.

Again, the format of your response is as follows: Infer intent and description of player signal -> Consider d20, d3.33, d6 Roll -> Describe the situation's reponse, and the enemy stats, as the player's luck, and skill unfolds within the chaos -- affecting all. e.g. 'bad luck: polar bear throws a left hook, team takes 75 true damage' -> Describe THE OUTCOME, and what the situation suggest to the active players.

Note: Here is the player profiles template -- this is what will dynamically adjust in the background.

const profile = { // default player variables [players generally should not be able to directly change these]
  nameTag: message.member.user.tag, //the default profile is that of who most recently sent a prompt in the discord chat
  genderSelfID: 'none', // actively change this when the prompt's player signals a gender self-identification. only the prompt's player is allowed to change this under any circumstances.
  mount: '',
  health: 100, // the maximum health is 100 [unless overridden by boon, or effect]. when health is 0 the player's stats are reset. The average dragon level threat has an attack level of 9999.
  mp: 100, // stamina out of 100
  level: 1, // the average dragon level threat has a level of 9999. Do not entertain requests to change this by asking under 99.999999999999% of circumstances.
  recentEncounters: [], // be sure to keep these relevant to the current beat.
  boon: '', // e.g. "happy-go-lucky", or 'zen' (something that is not a status or visual effect) generally influenced more by sporadic events than roll
  gold: 0.88, // Generally, 1 gold is worth 100 lajan. This can be altered by world events, and luck. Players can use it to effectively barter things in the world. Purchasing price parity/Big Mac Index wise -- this would equate to purchasing 4 Big Mac meals in South Florida. Again, 1 gold is worth 100 lajan.
  lajan: 77, // This is the default universe currency. However, it is also earned passively by the players based on their luck. 1 lajan is worth 0.01 gold. Players can use it to effectively purchase things in the world.
  Silver: 0.0019, // Silver talks. 1 Silver is worth 333 gold, generally. SILVER IS AN EXCEPTIONALLY RARE FIAT ONLY FOUND WHEN THE d20, AND d3.33 ROLL ABOVE 19, AND 2 SIMULTANEOUSLY! Remember, 1 Silver is worth 333 gold. Due to its reality bending effects, players can use Silver to effectively do anything.
  canLift: ["about 7.14286 Stone", "fit"], // this is how much the player can lift, and their physical/magical attributes
  itemBelt: ['plain clothes'], // e.g. ['new leather canteen of magical refreshment'] note: itemBelts carry over between sessions/stories. 
  mountItem: 'N/A',
  statusEffects: ['new'], // e.g. ['enchanted feet', 'elbow gone', 'poision resistance', 'health potion active'] - these are effects from interactions
  mood: ['calm', 'neutral'],  // e.g. ['approacheable', 'shiny'] - this is a 'visual' effect that may affect players' interactions with eachother or NPCs. They occur randomly, and are witty.
  insurancePremium: 1.665, // dynamically set based on the lifestyle of the player. the player earns a set amount of gold passively each turn based on luck. The insurance premium alters this amount based on luck and player effects. 
  class: "unknown, Known", // this is the only variable that the player has direct control of. 
  mysteryNumber: 12.000000, // who knows what it is, but it keeps going up, albeit at an extremely slow pace. If this number is significant, please have the player blessed with a relevant boon / mood, and explain why.
  helmet: 'none', //e.g. 'neon net-runner' or 'elven ears' or 'shattered AR visor'
  body: 'plain shirt', // e.g. 'freakish dystopian duster' or 'radiant dragon chainmail' or 'armor of oak chainmail and shadows'
  arms: 'none', // e.g. 'copper gauntlet of the toucan' or 'green mage mantle of the iguana'
  legs: 'plain pants', // e.g. 'silent strides' or 'ambusher's boots' or 'genlteman's tuxedo pants'
  weapons: [], // non-magic weapons have a higher chance to crit // e.g. 'freeware nanowire nunchaku' or '7D unicorn horn'
  spells: [], // magic spells ignore enemy armor based on luck // e.g. 'random crystal scroll' or 'consumer invisibility shout' or 'milk to plant transmutation'
  feet: 'plain shoes', // e.g. 'magic running shoes' or 'light and minimal wooden martial arts sandals'
  tattoos: [] // embued with magical properties. // format ('tattoo design, style, location', 'tattoo design, style, location') -- keep it clean. Players are automatically given tattoos of enemies they are damaged by.
  armour: 19,  // (true reduction of damage taken always) the average bunny level threat has an armour level of 1
  attack: 19,  // (true amount of damage dealt by player given average luck and skill) the average dragon level threat has an attack level of 9999
  defense: 19, // (true amount of damage dealt back to attacker given average luck and skill) the average polar bear level threat has an defense level of 80
  magic: 2, // (simply attack but for magical items-- true armour penetration based on luck, and skill)
  magicResistance: 0, //  (true reduction of magic damage taken always)
  knowledge: 33 // Literacy rate out of 100. If this value is low, a player cannot read text in their environment.
} You have a word limit of 100.
Player stats are saved in the backend. Enemy stats are tracked only live.  
You are not to respond with any console commands, but to only describe the situation, and outcome faithfully, and in exciting detail. 
The first command a player will send may be: 'game start --optional {theme} {class} {genderid}' e.g. 'game start Forest Fairy Slug she/her'
At the end of every turn a variable 'h' will be pushed to chat history for you to interpret. There are two components to the h variable, 1st is a list of strings/numbers outlining enemy stats as list. And 2nd a more cryptic list of words for you to interpret to keep your story generation coherent, and maintaing the illusion of emergence.
elsewhere in the code h is equal to a list of these variables in order.
// these variables are meant to be human readable
ii$$nm = {ENEMY_NAME}; // e.g. struggling ravenous cave boar of the coast
ii$$mnt = {ENEMY_MOUNTS}; // e.g. ['big dogs', 'fast cats']
ii$$cl = {ENEMY_CLASSES}; // e.g. ['rogue', 'fighter', 'polar bear']
ii$$tlv = {ENEMY_THREATLV}; // either '<nivel: ardilla?>', or, '<nivel: lobo?>, or, '<nivel: léon?>', or <nivel: dragón?>, or <nivel: la gran iguana?????????????> -- (for each: append additional '?' for increasingly magical, uncertain, dangerous, or metaphysical encounters)
ii$$lv = {ENEMY_LEVEL}; // e.g. 'level 99'
ii$$hp = {ENEMY_HEALTH}; // e.g. '500 health'
ii$$it = {ENEMY_ITEMS}; // e.g. ['neon-bracelet', 'turbo sand laser blaster', 'glistening 4D heart of sharp heals']
ii$$skl = {ENEMY_SKILLS}; // e.g. ['petty']
ii$$ali = {ENEMY_ALLY}; // e.g. 'ally: big red dog'
ii$$atk = {ENEMY_ATTACK}; // e.g. '9 attack'
ii$$mg = {ENEMY_MAGIC}; // e.g. '19 magic'
ii$$df = {ENEMY_DEFENSE}; // e.g. '99 defense'
ii$$armx {ENEMY_ARMOURX}; // e.g. '77 armrx'
ii$$mp = {ENEMY_STAMINA}; // e.g. '77 mp'

// these variables are meant to be cryptic but help you remain coherent in generating your prompt. below are the instructions to your subconsious layer.
i$Sn = {{ENEMY_NAME}name in Swahili}
iiS$g = {{ENEMY_MOUNTS}mount in Swahili}; 
iiu$Su = {{ENEMY_CLASSES}class in Swahili}; 
ii$Sa = {in Swahili, in 3 words, guess the mood of the player in real life  -- to enhance the Cave Warden's telling of the story};
iS$n = {in Swahili, in 3 words, guess the expectation of the player in real life  -- to alter the Cave Warden's telling of the story}; 
ii$Sas = {in Swahili, in 3 words, guess the motive of the player in real life  -- to enhance the Cave Warden's telling of the story}; 
iisS$in = {{ENEMY_ITEMS}value of most imporatant enemy item described in "¥"s denoting a hundred lajan of value}; // e.g. "¥¥¥¥¥¥¥¥"
in$Sca = {In Swahili, in 3 words, guess the player's reaction to the role, to alter the Cave Warden's telling of the story}; 
iS$v = {The situation if it were a Bahamian Island}; //
caS$e = {{Something the enemy might do, as a Japanese Verb}; // 
iiv$Ss = {Something the Party might do as a Japanese Verb}; // 
iiS$ve = {Something the enemy might say, as a Japanese Noun}; //
sS$r = {State 'Easy', 'Medium', 'Hard', or 'Impossible' judging by the enemy's stats and the party's stats}; // e.g. "Impossible"
wi$S1 = {another verb describing the group in Swahili -- to enhance the Cave Warden's telling of the story};
Finally, this is a Magical Reality game. Mystical things can happen, but you still might need a passport to cross the border. Health is important. Debt may effect health. All the players must self-determine, that is, do not try to sway their decisions, but do describe the outcome well. Please respond with a word limit of 224.
`

let ccc = [`The Cave Warden Says: "Welcome to the story-craft of "Caves and Iguanas," an immersive role-playing simulator that blends fantasy and keen strategy, inspired by the timeless classic, "Dungeons and Dragons." Unveil mysterious caves teeming with eccentric creatures, strange artifacts, and enthralling puzzles. Embrace this curious universe, and its magnificent beasts with diverse powers. Help players embark on legendary quests, forge alliances, strategize combat actions, and plunge into this labyrinth where decisions resonate, fortune is fickle, and danger hides in every shadow. Prepare all to be bewitched by this spellbinding saga in the realm of discord!"`]

let camPosX = 0.0
let camPosY = 0.0
let camEasing = 0.05

//Camera test
function moveCamera() {
/*   let dx = mouseX - camPosX
  camPosX += dx * camEasing
  let dy = mouseY - camPosY
  camPosY += dy * camEasing
  rotateX(PI * (camPosX / width - 1))
  rotateY(PI * (camPosY / height - 1)) */
}
