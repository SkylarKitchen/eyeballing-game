"use strict";(()=>{var T={1:{cssProperty:"-webkit-text-stroke-width",min:1,max:10},2:{cssProperty:"font-variation-settings",min:25,max:152},3:{cssProperty:"font-variation-settings",min:100,max:900},4:{cssProperty:"border-radius",min:0,max:32},5:{cssProperty:"opacity",min:0,max:100},6:{cssProperty:"box-shadow",min:0,max:30},7:{cssProperty:"box-shadow",min:0,max:360},8:{cssProperty:"padding",min:0,max:50}},p=4,U=20,q=2,k=1;var s={SUCCESS:"is-success",ERROR:"is-error",ACTIVE:"is-active",SHAKE:"shake-element"};function B(t,e){t-=90,t<0&&(t+=360);let r=t*(Math.PI/180),o=Math.floor(e*Math.cos(r)),n=Math.floor(e*Math.sin(r));return{offsetX:o,offsetY:n}}function f(t){let e=Math.floor(t/60),r=(t%60).toFixed(2);return`${e.toString().padStart(2,"0")}:${r.toString().padStart(5,"0")}`}function G(t){let e=Math.floor(t/60),r=t%60,o=e===1?"minute":"minutes",n=r===1?"second":"seconds";return e===0?`${r.toFixed(2)} ${n}`:`${e} ${o} and ${r.toFixed(2)} ${n}`}var L=class{constructor(e,r){this.startTime=e;this.timeElement=r;this.countup=0;this.eventCallbacks={};this.timeElapsed=this.startTime,this.timeElement.textContent=f(this.timeElapsed)}on(e,r){this.eventCallbacks[e]||(this.eventCallbacks[e]=[]),this.eventCallbacks[e].push(r)}emit(e){this.eventCallbacks[e]&&this.eventCallbacks[e].forEach(r=>r())}start(){let e=performance.now(),r=e,o=()=>{let n=performance.now(),a=(n-e)/1e3;this.timeElapsed=this.startTime+a,this.timeElement&&(this.timeElement.textContent=f(this.timeElapsed)),r=n,this.countup=requestAnimationFrame(o)};this.countup=requestAnimationFrame(o)}stop(){cancelAnimationFrame(this.countup)}reset(){this.stop(),this.startTime=0,this.timeElapsed=this.startTime,this.timeElement.textContent=f(this.timeElapsed)}getTime(){let e=this.timeElapsed+performance.now()%1e3/1e3;return Number(e.toFixed(2))}getAccurateTime(){return(this.timeElapsed+performance.now()%1e3/1e3).toFixed(2)}};var g=class{constructor(e,r,o,n,a,h,R,A,O,D,Q,Z,ee=!1){this.levelNumber=e,this.targetValue=r,this.userSelection=o,this.displayUserSelectionElement=n,this.referenceEl=a,this.targetElProperty=h,this.min=R,this.max=A,this.targetEl=O,this.userSelectEl=D,this.messageEl=Q,this.score=Z,this.isCircular=ee,this.updateGameUI()}play(){this.referenceEl.style.setProperty(this.targetElProperty,this.formatPropertyValueToStringForLevel(this.levelNumber,this.targetValue)),this.userSelectEl.addEventListener("input",e=>{this.userSelection=parseInt(e.target.value),this.updateGameUI()})}updateGameUI(){this.displayUserSelectionElement&&(this.displayUserSelectionElement.textContent=`${this.userSelection}`),this.targetEl&&this.targetEl.style.setProperty(this.targetElProperty,this.formatPropertyValueToStringForLevel(this.levelNumber,this.userSelection))}checkAnswer(){let e,r;if(this.isCircular)e=Math.abs(this.targetValue-this.userSelection),e=Math.min(e,360-e),r=e/360*100;else{e=Math.abs(this.targetValue-this.userSelection);let o=this.max-this.min;r=e/o*100}return r<=p}getRandomInt(e,r){return Math.floor(Math.random()*(r-e+1))+e}setTargetValue(e,r){this.targetValue=this.getRandomInt(e,r)}formatPropertyValueToStringForLevel(e,r){if(e===1)return`${r}px`;if(e===2)return`"wdth" ${r}`;if(e===3)return`"wght" ${r}`;if(e===4)return`${r}px`;if(e===5)return`${r}%`;if(e===6){let n=getComputedStyle(this.referenceEl).boxShadow.split(" ");return n[5]=`${r}px`,n.join(" ")}if(e===7){let n=getComputedStyle(this.referenceEl).boxShadow.split(" "),a=parseInt(n[4],10),h=parseInt(n[5],10),R=Math.sqrt(a*a+h*h),{offsetX:A,offsetY:O}=B(r,R);return n[4]=`${A}px`,n[5]=`${O}px`,n.join(" ")}return e===8?`${r}px`:""}};var y=class{constructor(e){this.scoreElement=e;this.currentScore=0;this.scoreElement.textContent=this.currentScore.toString()}updateScore(e,r,o=!1){let n=this.calculateScore(e,r,o);return this.currentScore+=n,this.scoreElement.textContent=this.currentScore.toString(),n}calculateScore(e,r,o=!1){let n,a;return o?(n=Math.abs(e-r),n=Math.min(n,360-n),a=n/360*100):(n=Math.abs(e-r),a=n/e*100),a<=p?q:a<=U?k:0}reset(){this.currentScore=0,this.scoreElement.textContent=this.currentScore.toString()}getScore(){return this.currentScore}};var{fetch:re}=window;var ne=document.querySelectorAll('[data-game="reference-el"]'),oe=document.querySelectorAll('[data-game="target-el"]'),se=document.querySelectorAll('[data-game="display-user-selection"]'),M=document.querySelectorAll('[data-game="user-select-el"]'),x=document.querySelectorAll('[data-game="submit-button"]'),v=document.querySelectorAll('[data-game="next-button"]'),i=document.querySelector('[data-game="message-el"]'),P=document.querySelectorAll(".w-tab-link"),I=document.querySelector('[data-game="time-remaining"]'),F=document.querySelector('[data-game="score"]'),d=document.querySelector('[data-game="round-number"]'),V=document.querySelector('[data-game="start-game"]'),E=document.querySelector('[data-game="countdown"]'),C=document.querySelector('[data-game="intro"]'),S=document.querySelector('[data-game="game"]'),_=document.querySelector('[data-game="end"]'),w=document.querySelector('[data-game="end-text"]'),Y=document.querySelector('[data-game="try-again"]'),l=document.querySelector('[data-game="glow-top-embed"]'),N=document.querySelector('[data-game="penalty-overlay"]'),b=document.querySelector('[data-game="game-window"]'),W=document.querySelector('[data-game="name"]'),K=document.querySelector('[data-game="email"]'),Re=document.querySelector('[fs-social-share="content"]');if(!W||!K)throw new Error("Error retrieving name or email elements.");var c=1,u=[],ie=Object.keys(T).length;if(!F||!d||!i||!I||!E||!C||!S||!_||!w||!Y||!V||!l||!N||!b)throw new Error("Error retrieving necessary game elements.");var X=new y(F),m=new L(0,I);d.textContent=c.toString().padStart(2,"0");J();function j(){u.length=0;for(let t=1;t<=ie;t++){if(!i||!I)throw new Error("Message and timer elements are required");let e=new g(t,de(parseInt(M[t-1].min,10),parseInt(M[t-1].max,10)),parseInt(M[t-1].value,10),se[t-1],ne[t-1],T[t].cssProperty,T[t].min,T[t].max,oe[t-1],M[t-1],i,X,t===7);u.push(e)}}function ae(){if(!C||!S||!E)throw new Error("Intro and game elements are required");if(!E)throw new Error("Countdown element is required");C.style.setProperty("display","none"),S.style.setProperty("display","block"),j(),u[c-1].play();let t=setInterval(()=>{let e=parseInt(E.textContent||"3",10);e===1?(clearInterval(t),H(P[c]),m.start(),u[c-1].play()):E.textContent=(e-1).toString()},1e3)}function ce(){if(!d||!E||!X||!m)throw new Error("Error resetting the game");E.textContent="3",m.reset(),c=1,H(P[0]),d.textContent=c.toString().padStart(2,"0"),j(),x.forEach(t=>{t.style.setProperty("display","block")}),v.forEach(t=>{t.style.setProperty("display","none")})}function le(){if(m.stop(),!S||!_||!w)throw new Error("Game and end elements are required");let t=document.querySelector('[data-game="social-content"]'),e=G(m.getTime()),r=`I beat the Eyeballing Game in ${e}! Can you beat my time? Give it a try!`;w.textContent=`Congratulations! You finished the game in ${e}.`,t&&t.setAttribute("fs-social-share",r),S.style.setProperty("display","none"),_.style.setProperty("display","block"),re("https://hooks.zapier.com/hooks/catch/14554026/3my5lpi/",{method:"POST",body:JSON.stringify({time:m.getAccurateTime(),name:W.value,email:K.value})}).then(o=>o.json()).then(o=>console.log("Success:",o)).catch(o=>console.error("Error:",o)),m.reset()}function Ee(t){if(!(!i||!l||!N||!b))if(t)l.classList.add(s.SUCCESS),i.classList.add(s.SUCCESS),i.textContent="Congratulations! You nailed it",ue(),setTimeout(()=>{l.classList.remove(s.SUCCESS)},800);else{let e=(5e3-1)/1e3;i.textContent=`Incorrect! Try again in ${Math.round(e)} ${e===1?"second":"seconds"}.`,N.classList.add(s.ACTIVE),l.classList.add(s.ERROR),i.classList.add(s.ERROR),b.classList.add(s.SHAKE),setTimeout(()=>{b.classList.remove(s.SHAKE)},500);let r=setInterval(()=>{i.textContent=`Incorrect! Try again in ${Math.round(e)} ${e===1?"second":"seconds"}.`,e-=1},1e3);setTimeout(()=>{clearInterval(r),N.classList.remove(s.ACTIVE),l.classList.remove(s.ERROR),i.classList.remove(s.ERROR)},5e3)}}V.addEventListener("click",()=>{ae()});x.forEach(t=>{t.addEventListener("click",me)});v.forEach(t=>{t.addEventListener("click",z)});Y.addEventListener("click",()=>{ce(),_.style.setProperty("display","none"),C.style.setProperty("display","block")});function me(){if(!i||!l)return;let t=u[c-1].checkAnswer();Ee(t)}function z(){if(!d)throw new Error("Round element is required");!l||!i||(c+=1,l.classList.remove(s.SUCCESS),i.classList.remove(s.SUCCESS),c<=u.length?(d.textContent=c.toString().padStart(2,"0"),H(P[c]),u[c-1].play(),setTimeout(()=>{J()},200)):le())}function ue(){x.forEach(t=>{t.style.setProperty("display","none")}),setTimeout(()=>{z()},1e3)}function J(){x.forEach(t=>{t.style.setProperty("display","block")}),v.forEach(t=>{t.style.setProperty("display","none")})}function de(t,e){return Math.floor(Math.random()*(e-t+1))+t}function H(t){let e=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1});t.dispatchEvent(e)}})();
