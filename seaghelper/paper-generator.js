/* Generates a separate original 56-question paper for each Set/Level/Paper choice. */
function buildSeagPaper(setNo, levelNo, paperNo) {
 let seed=(((setNo*11+levelNo)*7+paperNo)*2654435761)>>>0;
 const rand=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
 const int=(a,b)=>a+Math.floor(rand()*(b-a+1)), pick=a=>a[Math.floor(rand()*a.length)];
 const mix=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const tier=(setNo-1)*5+levelNo, names=["Amira","Callum","Niamh","Rory","Sofia","Ethan","Maya","Finn","Leah","Oscar","Zara","Noah","Grace","Aidan","Ivy","Lucas"];
 const places=["the harbour","a woodland trail","the town library","a hilltop farm","the railway station","the village hall","the old mill","a nature reserve","the school garden","the market square"];
 const things=["a brass compass","a faded photograph","a small leather notebook","a sealed wooden box","an unusual stone","a hand-drawn plan","a silver key","a glass bottle"];
 const tasks=["prepare an exhibition","help with a community project","investigate a local mystery","organise a charity event","record the history of the area","take part in a nature survey"];
 const name=pick(names),place=pick(places),thing=pick(things),task=pick(tasks);
 const obstacle=pick(["a sudden shower delayed the search","the path divided into three narrow tracks","the first clue was almost impossible to see","the caretaker had locked the side entrance","the wind scattered the notes across the grass","the group realised their first idea was mistaken"]);
 const discovery=pick(["a forgotten footpath","a record of an old flood","a hidden noticeboard","a family of nesting birds","a collection of letters","the remains of an earlier building"]);
 const detail=pick(["the paper smelled faintly of smoke","a narrow blue mark crossed its surface","one corner had been carefully repaired","a date was written in the margin","the edges were worn smooth","a tiny symbol had been drawn beside the title"]);
 const passage={title:pick(["A Clue by the Harbour","The Unexpected Discovery","A Record of the Past","The Search Begins","A Small Piece of History","The Mystery at "+place]),text:name+" had expected an ordinary afternoon helping at "+place+". The group had been asked to "+task+", and at first the work seemed straightforward. Then "+name+" noticed "+thing+". "+detail.charAt(0).toUpperCase()+detail.slice(1)+". Rather than putting it aside, "+name+" asked the others to take a closer look.\n\nThey decided to follow the information they had found. The first part of the journey was easy, but "+obstacle+". For a moment, the group considered giving up. Instead, they compared their notes, checked the details again and agreed on a different route. This careful approach led them towards "+discovery+".\n\n"+(tier>=6?"The group also considered whether the evidence could have more than one explanation. They discussed which details were reliable, separated observation from assumption and looked for information that could confirm their first impression. ":"")+(tier>=11?"Although the evidence appeared convincing, they recognised that a single discovery could not explain the whole history of the area. They considered what might be missing from the record and why different witnesses might remember events differently. ":"")+(tier>=16?"They evaluated the strengths and limitations of the information, asking whether the source was complete, how its purpose might affect what it recorded and what further evidence would be needed before reaching a firm conclusion. ":"")+(tier>=21?"The group finally compared competing interpretations and justified its conclusion by weighing the reliability, relevance and limitations of each clue rather than accepting the first explanation. ":"")+"By the end of the afternoon, the group understood that the discovery was important for a reason they had not expected. It offered evidence about how the area had changed and why local records should be protected. "+name+" wrote a clear account of what had happened so that other people could learn from it. The task had taken longer than planned, but the group left with a much better understanding of their surroundings."};
 const qs=[];
 const mc=(section,text,correct,distractors,explanation)=>{const opts=mix([String(correct)].concat(distractors.map(String)));return C(section,text,opts,opts.indexOf(String(correct)),explanation);};
 const WQ=(section,text,model,notes)=>W(section,text,model,notes);
 const spellings=[
 ["accommodate","accomodate","accommadate","acommodate","accommmodate"],["conscience","concience","consciense","conshience","conscince"],["rhythm","rythm","rhythym","rithm","rythem"],["embarrass","embarass","embarras","embarrase","embarras"],["definitely","definately","definitly","definatly","definetely"],["occasion","ocassion","ocasion","occassion","occaission"],["recommend","recomend","reccommend","recommened","recomend"],["opportunity","oportunity","oppurtunity","oppertunity","opportunety"],["familiar","familliar","familier","familar","fammiliar"],["persuade","perswade","persuede","persuad","perswaid"],["ancient","auncient","anciante","ancent","aincient"],["knowledge","knowlege","knowlidge","knowladge","knowledg"],["temperature","temprature","tempereture","temparature","temprerature"],["cemetery","cemetary","cemetry","cemeterey","cemetary"],["immediately","immediatly","imediately","immedietely","immediatley"],["excellent","exellent","excellant","excelent","excelllent"],["disappear","dissapear","disapear","dissappear","disappeer"],["particular","particuler","particullar","particualr","particuler"],["restaurant","restaraunt","resturant","resteraunt","restaurent"],["language","langauge","languge","langwage","langauge"],["separate","seperate","seperete","separrate","seperrate"],["business","buisness","bussiness","busines","buisines"],["necessary","neccessary","necesary","necessery","nessesary"],["environment","enviroment","environmant","envirronment","enviroment"],["privilege","privilage","priviledge","privlege","privillage"],["exaggerate","exagerate","exaggerrate","exagerrate","exaggerete"],["convenient","conveinient","convinient","conveniant","convenent"],["sincerely","sincerly","sincerley","sincirly","sincereley"],["maintenance","maintainance","maintenence","maintanance","maintenanse"],["independent","independant","independet","independant","independant"]
 ];
 const spellingFrames=[
  word=>"The writer checked the spelling of '"+word+"' before handing in the report.",
  word=>"The word '"+word+"' appeared in the final paragraph of the article.",
  word=>"The teacher asked the class to use the word '"+word+"' in a sentence.",
  word=>"A note in the visitor's notebook contained the word '"+word+"'.",
  word=>"The editor noticed that the word '"+word+"' had been included in the document.",
  word=>"During the lesson, the pupils discussed the meaning of '"+word+"'.",
  word=>"The word '"+word+"' was copied carefully onto the display board.",
  word=>"The report used the word '"+word+"' when describing the discovery."
 ];
 const spellingLayouts=[
  ["The word \"WORD\" appeared","in the writer's report,","which the editor checked","before publication."],
  ["The writer checked the spelling of","the word \"WORD\" before including it","in the report and","sending the final copy."],
  ["The writer prepared the report,","then checked the word","\"WORD\" before sending","the final copy to the editor."],
  ["The writer checked the report","before sending it to the editor","for a final review of","the word \"WORD\"."],
  ["The class studied the new vocabulary","and used the word \"WORD\"","in a sentence that they","shared with their teacher."]
 ];

 for(let i=0;i<5;i++){
  const row=pick(spellings);
  const hasError=rand()<0.8;
  const errorIndex=hasError?int(0,3):-1;
  const word=errorIndex<0?row[0]:pick(row.slice(1));
  const layout=spellingLayouts[hasError?errorIndex:int(0,3)];
  const sentence=layout.map((part,j)=>String.fromCharCode(65+j)+": "+part.replace("WORD",word)).join(" ");
  const correctLabel=errorIndex<0?"N":String.fromCharCode(65+errorIndex);
  qs.push(mc("Spelling","Read the one sentence, which is split into four parts. Which part (A, B, C or D) contains a spelling mistake? Choose N if the whole sentence is correct."+String.fromCharCode(10,10)+sentence,correctLabel,["A","B","C","D","N"].filter(x=>x!==correctLabel),"Read the whole sentence. Choose the letter of the section containing the spelling error, or N if every word is spelt correctly."));
 }
 const grammar=[
  ()=>{const subject=pick(["Each volunteer","Neither explorer","Every member of the committee","The collection of old maps","One of the younger pupils"]);return mc("Grammar","Choose the verb that completes the sentence: “"+subject+" ___ ready to present the findings.”","is",["are","have","were","be"],"The subject is singular, so the singular verb is required.");},
  ()=>{const person=pick(names);return mc("Grammar","Choose the correct pronoun: “"+person+" and ___ organised the display before the visitors arrived.”","I",["me","my","mine","myself"],"The pronoun is part of the subject, so “I” is correct.");},
  ()=>{const action=pick(["recorded the measurements","packed the equipment","checked the final list","locked the store room","completed the survey"]);return mc("Grammar","Choose the correct tense: “By the time the group arrived, the guide ___.”","had "+action,["has "+action,"will "+action,"is "+action,"have "+action],"The action happened before another past event, so the past perfect is appropriate.");},
  ()=>{const event=pick(["the path was muddy","the rain became heavier","the first plan failed","the hall was already crowded","the map was difficult to read"]);return mc("Grammar","Choose the conjunction: “The team continued their work ___ "+event+".“","although",["because","unless","therefore","despite of"],"“Although” introduces a contrasting clause.");},
  ()=>{const noun=pick(["players","teachers","visitors","runners","pupils","musicians","volunteers","scientists"]);return mc("Grammar","Which phrase correctly shows that the equipment belongs to several "+noun+"?","the "+noun+"' equipment",["the "+noun+" equipment","the "+noun+"'s equipment","the "+noun+"s' equipment","the "+noun+"es equipment"],"For a plural noun ending in s, the apostrophe follows the s.");}
 ];
 for(let i=0;i<5;i++)qs.push(grammar[i]());
 const plural=pick(["volunteers","visitors","artists","players","students","researchers","musicians","cyclists"]);
 const punct=[
  ["Choose the sentence in which the opening phrase is punctuated correctly.",["After visiting "+place+", "+name+" recorded the discovery.","After visiting, "+place+" "+name+" recorded the discovery.","After visiting "+place+" "+name+", recorded the discovery.","After visiting "+place+"; "+name+", recorded the discovery.","After visiting, "+place+", "+name+" recorded the discovery."],0,"A comma separates the introductory phrase from the main clause."],
  ["Which sentence uses the apostrophe correctly to show that several "+plural+" own the notes?",["The "+plural+"' notes were placed beside the map.","The "+plural+" notes' were placed beside the map.","The "+plural+"'s notes were placed beside the map.","The "+plural+"s notes were placed beside the map.","The "+plural+"s' notes was placed beside the map."],0,"The plural noun ends in s, so the apostrophe follows it."],
  ["Choose the sentence with correctly punctuated direct speech.",["“Please bring "+thing+" tomorrow,” said "+name+".","“Please bring "+thing+" tomorrow”, said "+name+".","Please bring "+thing+" tomorrow,” said "+name+".","“Please bring "+thing+" tomorrow” said, "+name+".","“Please bring "+thing+", tomorrow, said "+name+".“"],0,"The spoken words are enclosed in speech marks and the comma remains inside them."],
  ["Which option uses a colon correctly to introduce the list?",["The group packed three items: a map, "+thing+" and a torch.","The group packed: three items a map, "+thing+" and a torch.","The group: packed three items a map, "+thing+" and a torch.","The group packed three: items, a map, "+thing+" and a torch.","The group packed three items a map: "+thing+" and a torch."],0,"A colon introduces a list after a complete clause."],
  ["Which sentence is punctuated correctly as a direct question?",["Where had "+name+" left "+thing+"?","Where had "+name+" left "+thing+".","Where had "+name+" left "+thing+"!","Where, had "+name+" left "+thing+"?","Where had, "+name+" left "+thing+"?"],0,"A direct question ends with a question mark."]
 ];
 for(let i=0;i<5;i++){const p=punct[i];qs.push(mc("Punctuation",p[0],p[1][p[2]],p[1].filter((v,j)=>j!==p[2]),p[3]));}
 const compOpeners=[
  "Thinking about the group's visit, ",
  "According to the passage, ",
  "Using the information in the passage, ",
  "Which answer is best supported by the passage? ",
  "Look closely at the events described. "
 ];
 qs.push(mc("Comprehension",pick(compOpeners)+"what was the group originally asked to do?",task,["repair the railway station","prepare a sports competition","build a new road","collect money for a journey"],"The opening paragraph explains the purpose of the group's visit."));
 qs.push(mc("Comprehension","Which item first drew "+name+"'s attention during the visit?",thing,["a broken bicycle","a basket of fruit","a red umbrella","a wooden chair"],"The discovery is introduced in the first paragraph."));
 qs.push(mc("Vocabulary","In this passage, which meaning is closest to the word “evidence”?","information that helps show something is true",["a promise to do something later","a place where people meet","a plan for a future journey","a feeling of disappointment"],"Evidence is information or facts that support an idea."));
 qs.push(mc("Inference","What can the reader infer about the group's decision after the setback?","They wanted to check the details and choose a better approach.",["They had decided to stop helping.","They wanted to hide the object.","They had forgotten where they were.","They were waiting for the weather to change."],"They checked the details and agreed on a different route."));
 qs.push(mc("Comprehension","How did the group manage to make progress after the problem?", "They reviewed the information and changed their route.",["They ignored the clues.","They waited for another group.","They returned home immediately.","They followed the first idea without checking it."],"The second paragraph describes how they reconsidered their plan."));
 qs.push(mc("Writer’s purpose","What is the main reason the writer includes the final paragraph?","To show what the discovery taught the group and why records matter.",["To introduce a completely different character.","To explain how to build a road.","To describe the weather in detail.","To suggest that the task was pointless."],"The ending explains the significance of the discovery."));
 qs.push(mc("Inference","Which adjective best describes the group's attitude throughout the task?","determined",["careless","impatient","selfish","confused"],"They continued after a setback and checked their evidence carefully."));
 qs.push(WQ("Comprehension","Give two examples from the passage that show how the group responded when the task became difficult.","They compared their notes, checked the details again and agreed on a different route.","Use two actions from the second paragraph."));
 qs.push(WQ("Comprehension","State the group's aim when they arrived at "+place+".","They had been asked to "+task+".","Refer to the opening paragraph."));
 qs.push(WQ("Inference","Explain one reason why the discovery could be valuable to people who live nearby.","It provided evidence about how the area had changed and helped people understand and protect local records.","Explain what the discovery revealed."));
 qs.push(WQ("Writer’s methods","How does the writer make the setback seem challenging for the group?","The obstacle interrupts the group's progress, and the possibility of giving up makes the reader unsure whether they will succeed.","Refer to the setback and the group's reaction."));
 qs.push(WQ("Comprehension","Why did "+name+" decide to write an account of the events?","So that other people could learn from the discovery and understand why local evidence should be protected.","Use the final paragraph."));
 qs.push(WQ("Summary","Summarise the purpose, main challenge and outcome of the group's visit in two or three sentences.","The group visits "+place+" to "+task+". After finding "+thing+" and overcoming a difficulty, they discover "+discovery+". They record what happened so others can understand the area's history.","Include the purpose, challenge and outcome."));
 // Match the official SEAG English exercise order: punctuation, grammar, spelling, comprehension.
 const punctuationQuestions=qs.slice(10,15);
 const grammarQuestions=qs.slice(5,10);
 const spellingQuestions=qs.slice(0,5);
 const comprehensionQuestions=qs.slice(15,28);
 qs.splice(0,qs.length,...punctuationQuestions,...grammarQuestions,...spellingQuestions,...comprehensionQuestions);
 const max=12+tier*8, types=["add","subtract","multiply","divide","fraction","percent","decimal","ratio","perimeter","area","angle","measure","time","mean","money","scale","volume","range","fractionAdd","percentageChange","speed","probability"];
 function mathQ(type,written){
  let a,b,c,ans,section,text,explain,unit="",d;
  if(type==="add"){a=int(max,max*5);b=int(max,max*4);ans=a+b;section="Number";text="A school collection contains "+a+" items and receives another "+b+". How many items are there altogether?";explain="Add "+a+" and "+b+" to get "+ans+".";d=[ans+3,ans-4,a+b+10,Math.abs(a-b)];}
  else if(type==="subtract"){a=int(max*3,max*8);b=int(2,a-1);ans=a-b;section="Number";text="A hall has "+a+" seats. If "+b+" are occupied, how many seats remain?";explain="Subtract "+b+" from "+a+" to get "+ans+".";d=[ans+b,ans+3,b-a,a+b];}
  else if(type==="multiply"){a=int(3,12+Math.ceil(tier*1.5));b=int(4,18+tier*2);ans=a*b;section="Number";text="There are "+a+" boxes with "+b+" cards in each box. How many cards are there altogether?";explain=a+" × "+b+" = "+ans+".";d=[ans+a,ans-b,a+b,ans+a*2];}
  else if(type==="divide"){b=int(3,12);ans=int(5,25+tier*5);a=b*ans;section="Number";text="A total of "+a+" tickets is shared equally between "+b+" groups. How many tickets does each group receive?";explain=a+" ÷ "+b+" = "+ans+".";d=[ans+b,ans-1,ans*2,a-b];}
  else if(type==="fraction"){b=pick(tier>=16?[2,3,4,5,6,8,10,12,15,20]:tier>=8?[2,3,4,5,6,8,10,12]:[2,3,4,5,6,8,10]);let k=int(2,5),n=int(1,b-1);a=b*k;ans=n*k;section="Fractions";text="What is "+n+"/"+b+" of "+a+"?";explain=a+" ÷ "+b+" = "+k+", then "+k+" × "+n+" = "+ans+".";d=[ans+n,ans+b,a-n,ans+2];}
  else if(type==="percent"){a=int(2,20)*5;b=pick([10,15,20,25,30,40,50]);ans=a*b/100;section="Percentages";text="A group has "+a+" members. "+b+"% of them chose the same activity. How many members is this?";explain=b+"% of "+a+" is "+ans+".";d=[ans+1,ans+2,a-b,ans*2];}
  else if(type==="decimal"){a=int(11,95)/10;b=int(11,85)/100;ans=Number((a+b).toFixed(2));section="Decimals";text="Calculate "+a.toFixed(1)+" + "+b.toFixed(2)+".";explain=a.toFixed(2)+" + "+b.toFixed(2)+" = "+ans.toFixed(2)+".";d=[ans+0.1,ans-0.1,Number((a-b).toFixed(2)),ans+1];}
  else if(type==="ratio"){a=int(2,5);b=int(2,6);let total=(a+b)*int(3,9);ans=a*total/(a+b);section="Ratio";text="The ratio of red to blue counters is "+a+":"+b+". There are "+total+" counters altogether. How many are red?";explain="There are "+(a+b)+" parts; each part is "+(total/(a+b))+". The red share is "+ans+".";d=[ans+a,ans+b,total-ans,a+b];}
  else if(type==="perimeter"){a=int(4,20);b=int(3,15);ans=2*(a+b);section="Shape";unit=" cm";text="A rectangular noticeboard is "+a+" cm long and "+b+" cm wide. Calculate its perimeter.";explain="Perimeter = 2 × ("+a+" + "+b+") = "+ans+" cm.";d=[a*b,2*a+b,a+2*b,ans+2];}
  else if(type==="area"){a=int(4,20);b=int(3,15);ans=a*b;section="Shape";unit=" m²";text="A rectangular garden is "+a+" m long and "+b+" m wide. Calculate its area.";explain="Area = "+a+" × "+b+" = "+ans+" m².";d=[2*(a+b),ans+a,ans+b,a+b];}
  else if(type==="angle"){a=int(25,75);b=int(25,85);if(a+b>150)b=35;ans=180-a-b;section="Angles";unit="°";text="Two angles in a triangle are "+a+"° and "+b+"°. Calculate the third angle.";explain="180 − "+a+" − "+b+" = "+ans+"°.";d=[180-a,180-b,a+b,ans+10];}
  else if(type==="measure"){a=int(12,95)/10;ans=Math.round(a*1000);section="Measures";unit=" m";text="A walking route is "+a.toFixed(1)+" kilometres long. How many metres is this?";explain="1 km = 1,000 m, so the distance is "+ans+" m.";d=[ans/10,ans*10,ans+100,ans-100];}
  else if(type==="time"){a=int(1,3);b=int(10,50);ans=a*60+b;section="Time";unit=" minutes";text="A journey takes "+a+" hour"+(a===1?"":"s")+" and "+b+" minutes. How many minutes is this altogether?";explain=a+" × 60 + "+b+" = "+ans+" minutes.";d=[ans+10,ans-10,a+b,ans*2];}
  else if(type==="mean"){let vals=[int(4,20),int(5,22),int(6,24),int(7,26)];ans=vals.reduce((x,y)=>x+y,0)/4;section="Data";text="Find the mean of "+vals.join(", ")+ ".";explain="The total is "+vals.reduce((x,y)=>x+y,0)+". Divide by 4 to get "+ans+".";d=[ans+1,ans-1,Math.max(...vals),Math.min(...vals)];}
  else if(type==="money"){a=int(2,9);b=int(10,95);ans=Number((a*b/100).toFixed(2));section="Money";unit="";text="A notebook costs £"+(b/100).toFixed(2)+". What is the cost of "+a+" notebooks?";explain="Multiply £"+(b/100).toFixed(2)+" by "+a+" to get £"+ans.toFixed(2)+".";d=["£"+(ans+1).toFixed(2),"£"+(ans-0.5).toFixed(2),"£"+(a+b/100).toFixed(2),"£"+(ans+0.2).toFixed(2)];ans="£"+ans.toFixed(2);}
  else if(type==="scale"){a=int(2,9);b=int(2,8);ans=a*b;section="Measures";unit=" km";text="On a map, 1 cm represents "+b+" km. Two places are "+a+" cm apart. What is the actual distance?";explain=a+" × "+b+" = "+ans+" km.";d=[ans+a,ans-b,a+b,ans*2];}
  else if(type==="volume"){a=int(2,8);b=int(2,7);c=int(2,6);ans=a*b*c;section="Measures";unit=" cm³";text="A cuboid measures "+a+" cm by "+b+" cm by "+c+" cm. Calculate its volume.";explain=a+" × "+b+" × "+c+" = "+ans+" cm³.";d=[a*b,a+b+c,ans+a,ans-c];}
  else if(type==="range"){let v=Array.from({length:5},()=>int(4,60));ans=Math.max(...v)-Math.min(...v);section="Data";text="Find the range of these values: "+v.join(", ")+ ".";explain="Range = "+Math.max(...v)+" − "+Math.min(...v)+" = "+ans+".";d=[ans+1,ans-1,Math.max(...v),Math.min(...v)];}
  else if(type==="fractionAdd"){let den=pick([4,5,6,8,10]),n1=int(1,den-2),n2=int(1,den-n1-1);ans=(n1+n2)+"/"+den;section="Fractions";text="Calculate "+n1+"/"+den+" + "+n2+"/"+den+".";explain="Add the numerators to get "+ans+".";d=["1/"+den,(n1+n2+1)+"/"+den,n1+"/"+(den*2),n2+"/"+den];}
  else if(type==="percentageChange"){a=int(20,100);b=pick([10,15,20,25]);ans=Number((a*(1-b/100)).toFixed(2));section="Percentages";text="A £"+a+" item is reduced by "+b+"%. What is its new price?";explain=b+"% of £"+a+" is £"+(a*b/100).toFixed(2)+". The new price is £"+ans.toFixed(2)+".";d=["£"+(ans+2).toFixed(2),"£"+(ans-2).toFixed(2),"£"+(a*b/100).toFixed(2),"£"+a.toFixed(2)];ans="£"+ans.toFixed(2);}
  else if(type==="speed"){a=int(2,8);b=int(2,5);ans=a*b;section="Speed";unit=" km";text="A cyclist travels at "+a+" km per hour for "+b+" hours. How far does the cyclist travel?";explain="Distance = speed × time = "+a+" × "+b+" = "+ans+" km.";d=[a+b,ans+2,ans-2,a+b*2];}
  else {a=int(2,5);b=int(2,5);ans=a+"/"+(a+b);section="Probability";text="A bag contains "+a+" green counters and "+b+" yellow counters. What is the probability of choosing a green counter?";explain="There are "+a+" green counters out of "+(a+b)+" altogether, so the probability is "+ans+".";d=["1/2","1/"+(a+b),b+"/"+(a+b),"2/"+(a+b)];}
  if(written){let accepted=[String(ans),String(ans).replace(/\.00$/,""),String(ans).replace(/^£/,""),String(ans)+(unit||""),String(ans).replace(/^£/,"")+(unit||"")];return N(section,text,accepted,String(ans)+(unit||""),explain);}
  let correct=String(ans)+(unit||"");let opts=d.map(x=>String(x)+(unit||""));return mc(section,text,correct,opts,explain);
 }
 for(let i=0;i<22;i++)qs.push(mathQ(types[i],false));
 for(let i=0;i<6;i++)qs.push(mathQ(types[(i*3+7)%types.length],true));
 if(qs.length!==56)throw new Error("Generated paper has "+qs.length+" questions, not 56.");
 return {passage:passage,questions:qs};
}