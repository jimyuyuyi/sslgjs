/** Super-Lite Line Graphing JS library v1.4
* jimyuyuyi@gmail.com
*
* Redistributions of this source code must retain this copyright
* notice and the following disclaimer.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* Commercial use may be granted to the extent that this source code
* does NOT become part of any other Open Source or Commercially licensed
* development library or toolkit without explicit permission.
**/
var SLLG=function(pari,mapdatai,opts)
{	var t_=this,ud,nan=Number.NaN,clrary=[];
	var defopts={
		grpary:ud,colors:[],endfunc:ud,
		xhili:ud,yhili:ud,ser_hide:[],loadlbl:ud,lineThickness:1.5,areafill:false,
		xmin:nan,xmax:nan,xinc:nan,xincsub:nan,xary:ud,xincgap:nan,xtimeflag:ud, xincsub_addflag:true,
		ymin:nan,ymax:nan,yscale:nan,ydec:4,yunit:ud,yudlbl:'NODATA',ypowadjust:true,fillwithprev:false,
		rpthrs:nan,rpthre:nan,combinemod:nan,colind:nan,ymultintrvl:nan,
		yrecalc_limit:21600,loopbrk:nan,resizewait:500,movewait:40,
		statpar:ud,statmin:true,statmax:true,statavg:true,stat_triglbl:true,statpct:nan,
		stattimenode:ud,statcolorlines:ud,statbench:nan,statbenchdesc:ud,
		zoomcolor:'rgba(128,128,128,0.33)',gridcolor:'gray',
		gridsize:2,gridopacity:0.2,hili_size:6,yavglsize:2,yleftmargin:5,yrightmargin:0,xlblmargin:4
	};var genvars={
		par:pari,mapdata:mapdatai,excanvflag:(typeof(G_vmlCanvasManager)!=''+ud),
		ptcanvs:[],ptcanvorigs:[],mousecanv:0,hilnds:[],grpistr:ud,ms_start:ud,
		zind0:0,wi_:0,hei_:0,ylblw:0,ylblh:0,lh:0,dragcord:ud,
		xlbmin:0,xaxmin:0,xaxmax:0,xaxinc:0,xsameyr:true,
		yaxmin:0,yaxmax:0,yaxinc:0,yaxmin0:ud,yaxmax0:ud,
		sclx:0,scly:0,xloopn:0,yminact:0,ymaxact:0,
		ofstbleft:0,ofstbtop:0,mousevtset:ud,drawdone:ud,iszoomed:ud,
		ysclac:1,ypowpre:ud,yunitact:ud,yvprev:nan,
		plotdata:{},statlbls:[],statcol_lnodes:{},yavgls:[],lgelbls:[],yhisubs:[],
		stat_arys:{ser_ysum:[],ser_xcnt:[],ser_benchcnt:[],ser_maxpt:[],ser_vals:[],ser_minpt:[]},
		stat_origs:ud,sbnchnode:ud,mvtimer:ud,gi_:0,loopc:0,
		xpathstart:ud,xlastdraw:ud,xlastmove:ud,pathsize:0
	};
	for(var k in defopts)
	{	if(opts[k]!=ud)
		{	t_[k]=opts[k];
		}else
		{	t_[k]=defopts[k];
		}
	}for(var k in genvars){t_[k]=genvars[k];}
	t_.par=SLLG.getnodebyname(t_.par);
	if(!t_.par){t_.par=document.body;}
	else if(!t_.par.style.position|| !t_.par.style.position.match(/\w/))
	{	t_.par.style.position='relative';
	}if(!isNaN(t_['statpct'])&&(t_['statpct']>100||t_['statpct']<0))
	{	t_['statpct']=nan;
	}if(t_.xinc==0){t_.xinc=nan;}
	if(isNaN(t_.loopbrk))
	{	if(t_.excanvflag)
		{	t_.loopbrk=30000;
		}else if(t_.loadlbl)
		{	t_.loopbrk=40000;
		}
	}if(SLLG.isArray(t_.xary)&& t_.xary.length>0)
	{	t_.xtimeflag=ud;
		if(isNaN(t_.xmin))
		{	t_.xmin=0;
		}if(isNaN(t_.xmax))
		{	t_.xmax=t_.xary.length-1;
		}
	}else
	{	t_.xary=ud;
		if(isNaN(t_.xmax)||isNaN(t_.xmin)||isNaN(t_.xinc))
		{	if(isNaN(t_.xmin)){t_.xmin=Infinity;}
			if(isNaN(t_.xmax)){t_.xmax=-Infinity;}
			var trycnt=0;
			for(var grp in t_.mapdata)
			{	var x0=nan;
				for(x in t_.mapdata[grp])
				{	trycnt++;
					if(trycnt>=t_.yrecalc_limit){break;}
					x=parseFloat(x);
					if(isNaN(x)||isNaN(t_.mapdata[grp][x]))
					{	continue;
					}if(t_.xmax<x)
					{	t_.xmax=x;
					}if(t_.xmin>x)
					{	t_.xmin=x;
					}if(isNaN(t_.xinc))
					{	if(isNaN(x0))
						{	x0=x;
						}else
						{	t_.xinc=x-x0;
						}
					}
				}if(trycnt>=t_.yrecalc_limit){break;}
			}if(t_.xmin==Infinity)
			{	t_.xmin=0;
			}if(t_.xmax==-Infinity)
			{	t_.xmax=t_.xmin;
			}
		}
	}
	if(isNaN(t_.xinc)){t_.xinc=1;}
	if(!isNaN(t_.xincsub)&& (t_.xincsub==0||Math.abs(t_.xincsub)>=Math.abs(t_.xinc)))
	{	t_.xincsub=nan;
	}
	if(t_.xtimeflag==ud&& t_.xmin>=86400000&& t_.xmax>=86400000)
	{	t_.xtimeflag=true;
	}if(!t_.grpary||!t_.grpary.length||t_.grpary.length<=0)
	{	t_.grpary=[];
		for(var grp in t_.mapdata)
		{	t_.grpary.push(grp);
		}
	}if(!isNaN(t_.yscale)&& (t_.yscale==1||t_.yscale==0))
	{	t_.yscale=nan;
	}if(t_.yunit==ud){t_.ypowadjust=false;}
	if(t_.grpary.length<=0)
	{	return;
	}for(var gi=0;gi<t_.grpary.length;gi++)
	{	var colr=ud;
		if(t_.grpary[gi]!=ud)
		{	if(t_.colors.length>0)
			{	colr=t_.colors.shift();
			}else
			{	colr='black';
			}
		}clrary[gi]=colr;
	}t_.colors=clrary;
	if(t_.xtimeflag&&(!isNaN(t_.rpthrs)||!isNaN(t_.rpthre)))
	{	var dobj=new Date(),hc,hs=t_.rpthrs,he=t_.rpthre;
		if(!isNaN(t_.xmin)&&!isNaN(hs))
		{	dobj.setTime(t_.xmin);hc=dobj.getHours();
			if((!isNaN(hs)&& hc<hs&&(isNaN(he)||hs<he|| hc>he))||
				(!isNaN(hs)&& !isNaN(he)&& hs>=he&& hc<hs))
			{	dobj.setHours(hs);
				dobj.setMinutes(0);dobj.setSeconds(0);dobj.setMilliseconds(0);
				t_.xmin=dobj.getTime();
			}
		}if(!isNaN(t_.xmax)&&!isNaN(he))
		{	dobj.setTime(t_.xmax);hc=dobj.getHours();
			if((!isNaN(he)&& hc>=he&&(isNaN(hs)||hs<he))
				||(!isNaN(hs)&& !isNaN(he)&& hs>=he&& hc>he))
			{	dobj.setHours(he);
				dobj.setMinutes(0);dobj.setSeconds(0);dobj.setMilliseconds(0);
				t_.xmax=dobj.getTime();
			}
		}if(!isNaN(hs)&&!isNaN(he)&&he<hs)
		{	t_.rpthrs=nan;	t_.rpthre=nan;
		}if(!isNaN(he)&&he<0)
		{	t_.rpthre=nan;
		}
	}if(t_.yunit!=ud&&(typeof(t_.yunit)).match(/^str/i)&& !t_.yunit.match(/[^ ]/))
	{	t_.yunit=ud;
	}
	if(!isNaN(t_.ymultintrvl)&& t_.ymultintrvl==0)
	{	t_.ymultintrvl=nan;
	}
	for(var gi=0;gi<t_.grpary.length;gi++)
	{	var grp=t_.grpary[gi];
		if(grp!=ud&& !t_.mapdata[gi]&& t_.mapdata[grp])
		{	t_.grpistr=true;
			break;
		}
	}if(!t_.excanvflag&& t_.par.tagName.match(/canvas/i))
	{	t_.mousecanv=t_.par;
		t_.par=t_.par.parentNode;
	}t_.zind0=parseFloat(SLLG.getcompstyle(t_.par,'z-index'));
	if(isNaN(t_.zind0)){t_.zind0=0;}
	if(t_['statpar'])
	{	t_['statpar']=SLLG.getnodebyname(t_['statpar']);
	}if(t_.loadlbl)
	{	t_.loadlbl=SLLG.getnodebyname(t_.loadlbl);
		if(!t_.loadlbl)
		{	t_.loadlbl=document.createElement('div');
			t_.loadlbl.className='SLLG_loadlbl';
			with(t_.loadlbl.style){position='absolute';left='20%';top='0%';
				zIndex=t_.zind0+t_.grpary.length+9;}
			t_.par.appendChild(t_.loadlbl);
		}
	}if(!t_.mousecanv)
	{	t_.mousecanv=document.createElement('canvas');
		t_.mousecanv.className='SLLG_mousecanv';
	}with(t_.mousecanv.style)
	{	position='absolute';top='0px';
		cursor='default';zIndex=t_.zind0+t_.grpary.length+10;
	}t_.par.appendChild(t_.mousecanv);
	if(t_.excanvflag)
	{	t_.mousecanv=G_vmlCanvasManager.initElement(t_.mousecanv);
	}t_.mslast=(new Date()).getTime();
	t_.loopc=-1;
	var gm=t_.combinemod;
	if(!gm||isNaN(gm)||t_.grpary.length<gm)
	{	t_.drawzoom();
	}else
	{	t_.checkdocombine();
	}
};
SLLG.prototype.getmapdata=function(grp,xv)
{	var t_=this,yv,xe,ud;
	xe=xv+t_.xinc;
	if(t_.xtimeflag&& t_.xinc>=86400000)
	{	var xv0=xv;
		xv=SLLG.timeround(xv,t_.xinc);
		xe=SLLG.timeround(xe,t_.xinc);
	}if(t_.plotdata[grp]&& t_.plotdata[grp][xv])
	{	return t_.plotdata[grp][xv];
	}
	if(isNaN(t_.ysclac)){t_.ysclac=t_.yscale;}
	if(isNaN(t_.ysclac)){t_.ysclac=1;}
	var yv=t_.getmapdata_range(grp,xv,xe);
	if(!isNaN(yv)&& !isNaN(t_.ysclac))
	{	yv=SLLG.rounddec(yv/t_.ysclac,t_.ydec);
	}if(t_.plotdata[grp])
	{	t_.plotdata[grp][xv]=yv;
	}return yv;
};
SLLG.prototype.getmapdata_range=function(grp,xs,xe)
{	var t_=this,yv,ud;
	if(isNaN(t_.xincsub))
	{	yv=t_.getmapdata_sub(grp,xs);
	}else
	{	var xlast=ud,ymultmin;
		for(var xv=xs;xv<xe;xv+=t_.xincsub)
		{	var yv2=t_.getmapdata_sub(grp,xv);
			if(isNaN(yv2)){continue;}
			if(!isNaN(t_.ymultintrvl)&& xlast!=ud)
			{	var ymult=Math.ceil((xv-xlast)/t_.ymultintrvl);
				if(isNaN(ymultmin)|| ymultmin>ymult)
				{	ymultmin=ymult;
				}
			}xlast=xv;
			if(!t_.xincsub_addflag)
			{	yv=yv2;
				break;
			}yv=(yv?yv:0)+yv2;
		}//special case: non-existant date end, count entire day for whole multipier
		if(!isNaN(t_.ymultintrvl)&&isNaN(ymultmin)&& xlast!=ud&& t_.xtimeflag&& t_.xinc>=86400000)
		{	ymultmin=Math.ceil(t_.xinc/t_.ymultintrvl);
		}if(ymultmin<=1)
		{	ymultmin='nan';
		}if(!isNaN(yv)&& !isNaN(ymultmin))
		{	yv*=ymultmin;
		}
	}if(yv==ud&&!isNaN(t_['yudlbl']))
	{	yv=t_['yudlbl'];
	}return yv;
};
SLLG.prototype.getmapdata_sub=function(grp,xv)
{	var t_=this,yv,divecnt=0,ud;
	if(grp==ud||xv==ud||isNaN(xv)||t_.grpary[grp]==ud)
	{	return yv;
	}if(t_.grpistr&& t_.grpary[grp]!=ud){grp=t_.grpary[grp];}
	if(t_.mapdata[grp]!=ud&& t_.mapdata[grp][xv]!=ud)
	{	var yv=t_.mapdata[grp][xv];
	}while(yv!=ud&& SLLG.isArray(yv)&& divecnt<10)
	{	if(yv.length<=0){yv=ud;}
		else if(!isNaN(t_.colind)&& t_.colind>=0)
		{	if(t_.colind<yv.length)
			{	yv=yv[t_.colind];
			}else{yv=0;}
		}else
		{	yv=yv[yv.length-1];
		}divecnt++;
	}return yv;
};
SLLG.prototype.checkdocombine=function()
{	var t_=this,ud;
	var gm=t_.combinemod;
	if(gm<2){gm=2;}
	if(!t_.newgrpary)
	{	t_.newgrpary=[];t_.tmpmap={};
		for(var i=0;i<t_.grpary.length;i+=gm)
		{	var newgrp=t_.grpary[i].replace(/(in|out)bound/i,'Total');
			t_.newgrpary.push(newgrp);
		}
	}var xv=t_.xmin;
	t_.ysclac=t_.yscale;
	do
	{	t_.loopc++;
		xv=(t_.loopc*t_.xinc)+t_.xmin;
		if(xv>t_.xmax){break;}
		for(var i=0;i<t_.grpary.length;i+=gm)
		{	if((i+gm-1)>=t_.grpary.length){break;}
			var yv=0,nanflag=true;
			for(var j=0;j<gm;j++)
			{	var yv2=t_.getmapdata_range(i+j,xv,xv+t_.xinc);
				if(!isNaN(yv2))
				{	yv+=yv2;
					nanflag=false;
				}
			}if(nanflag){yv=Number.NaN;}
			var newgrp=Math.floor(i/gm);
			if(t_.grpistr)
			{	newgrp=t_.newgrpary[newgrp];
			}if(!t_.tmpmap[newgrp]){t_.tmpmap[newgrp]={};}
			t_.tmpmap[newgrp][xv]=yv;
		}if(!isNaN(t_.loopbrk)&& t_.loopc%t_.loopbrk==0)
		{	if(t_.loadlbl)
			{	t_.loadlbl.innerHTML='Combining series data: '+Math.round(100*t_.loopc*t_.xinc/(t_.xmax-t_.xmin))+'% done';
			}window.setTimeout(function(e){t_.checkdocombine();});
			break;
		}
	}while(xv<=t_.xmax);
	if(xv>t_.xmax)
	{	t_.mapdata=t_.tmpmap;
		t_.grpary=t_.newgrpary.slice(0);
		delete(t_.newgrpary);
		var mscur=(new Date()).getTime();
		t_.mslast=(new Date()).getTime();
		return t_.drawzoom();
	}
}
SLLG.prototype.xval2cord=function(xv,absflag)
{	if(isNaN(xv)){return xv;}
	var t_=this;
	var xc=(xv-t_.xaxmin)*t_.sclx;
	if(absflag)
	{	xc+=t_.ylblh+t_.ylblw+t_.yleftmargin;
	}return xc;
};
SLLG.prototype.xcord2val=function(xc)
{	if(isNaN(xc)){return xc;}
	var t_=this,ud;
	xc-=t_.ofstbleft;
	var xv=(xc/t_.sclx)+t_.xaxmin;
	if(t_.xtimeflag&& t_.xinc>7200000)
	{	dobj=new Date(xv);
		dobj.setHours(12);dobj.setMinutes(0);dobj.setSeconds(0);dobj.setMilliseconds(0);
		if(xv<dobj.getTime())
		{	dobj.setHours(0);
		}else
		{	dobj.setHours(24);
		}xv=dobj.getTime();
	}else if(t_.xinc>=1)
	{	if(xv%t_.xinc>(t_.xinc/2))
		{	xv+=t_.xinc;
		}xv-=xv%t_.xinc;
	}return xv;
};
SLLG.prototype.yval2cord=function(yv)
{	if(isNaN(yv)){return yv;}
	var t_=this;
	var yc=t_.hei_-((yv-t_.yaxmin)*t_.scly);
	return yc;
};
SLLG.prototype.ycord2val=function(yc)
{	if(isNaN(yc)){return yc;}
	var t_=this;
	yc-=t_.ofstbtop;
	var yv=((t_.hei_-yc)/t_.scly)+t_.yaxmin;
	return yv;
};
SLLG.prototype.evtsetup=function(el,evt)
{	var t_=this;
	var fn=function(e){
		if(!t_|| !t_[evt+'_']){return false;}
		return t_[evt+'_'](e);};
	SLLG.evtadd(el,evt,fn);
};
SLLG.prototype.mousedown_=function(e)
{	e=e?e:window.event;
	var t_=this,btn=e.which?e.which:e.button,ud;
	SLLG.evtcancel(e);
	if(!t_.drawdone){return false;}
	if(btn<=1&& t_.dragcord==ud)
	{	t_.dragcord=[SLLG.mousepos(e,'X'),SLLG.mousepos(e,'Y')];
		t_.mousecanv.style.cursor='move';
		for(var i=0;i<t_.hilnds.length;i++)
		{	if(!t_.hilnds[i]){continue;}
			t_.hilnds[i].style.visibility='hidden';
		}
	}return false;
};
SLLG.prototype.mouseup_=function(e)
{	e=e?e:window.event;
	var t_=this,btn=e.which?e.which:e.button,ud;
	SLLG.evtcancel(e);
	if(!t_.drawdone){return false;}
	if(t_.dragcord!=ud)
	{	var xc=SLLG.mousepos(e,'X');
		var xvary=[t_.xcord2val(t_.dragcord[0]),t_.xcord2val(xc)];
		if(xvary[1]<xvary[0])
		{	var xv0=xvary[0];
			xvary[0]=xvary[1];
			xvary[1]=xv0;
		}t_.dragcord=ud;
		var ctx=t_.mousecanv.getContext('2d')
		ctx.clearRect(0,0,t_.mousecanv.width,t_.mousecanv.height);
		if(xvary[1]-xvary[0]>=t_.xinc)
		{	if(t_.xval2cord(xvary[1],true)<xc)
			{	xvary[1]+=t_.xinc;
			}t_.drawzoom(xvary[0],xvary[1]);
		}else if(t_.xaxmin!=t_.xmin||t_.xaxmax!=t_.xmax)
		{	t_.drawzoom();
		}else
		{
		}t_.mousecanv.style.cursor='default';
	}return false;
};
SLLG.prototype.mousewheel_=function(e)
{	e=e?e:window.event;
	var t_=this,ud,delta=Math.max(-1,Math.min(1,(e.wheelDelta||-e.detail)))
	SLLG.evtcancel(e);
	if(!t_.drawdone){return false;}
	var xmin_new=t_.xaxmin-(60*t_.xinc),xmax_new=t_.xaxmax+(60*t_.xinc);
	if(delta>0)
	{	var xc=SLLG.mousepos(e,'X');
		var xv=t_.xcord2val(xc);
		xmin_new=xv-(t_.xinc*(Math.round(t_.loopc/2)-20));
		xmax_new=xv+(t_.xinc*(Math.round(t_.loopc/2)-20));
	}if(xmin_new<t_.xmin)
	{	xmin_new=t_.xmin;
	}else if(xmin_new>xmax_new-(2*t_.xinc))
	{	xmin_new=xmax_new-(2*t_.xinc);
	}if(xmax_new>t_.xmax)
	{	xmax_new=t_.xmax;
	}else if(xmax_new<xmin_new+(2*t_.xinc))
	{	xmax_new=xmin_new+(2*t_.xinc);
	}
	if(t_.xaxmin!=xmin_new||t_.xaxmax!=xmax_new)
	{	t_.drawzoom(xmin_new,xmax_new);
	}return false;
};
SLLG.prototype.resize_=function(e)
{	e=e?e:window.event;
	var t_=this,ud;
	SLLG.evtcancel(e);
	if(!t_.drawdone||(!isNaN(t_.yrecalc_limit)&& t_.xloopn>t_.yrecalc_limit))
	{	return false;
	}t_.drawdone=false;
	if(t_.yaxmin0!=ud)
	{	t_.yaxmin=t_.yaxmin0;t_.yaxmax=t_.yaxmax0;
	}setTimeout(function(e){return t_.drawstart();},t_.resizewait);
	return false;
};
SLLG.prototype.mousemove_=function(e)
{	var t_=this,ud;
	e=e?e:window.event;SLLG.evtcancel(e);
	if(!t_.drawdone){return false;}
	var xc=SLLG.mousepos(e,'X'),yc=SLLG.mousepos(e,'Y');
	if(t_.dragcord!=ud&& t_.zoomcolor)
	{	var ctx=t_.mousecanv.getContext('2d');
		ctx.clearRect(0,0,t_.mousecanv.width,t_.mousecanv.height);
		ctx.fillStyle=t_.zoomcolor;
		var ofl=t_.ofstbleft-(2*t_.yleftmargin);
		var xcary=[t_.dragcord[0]-ofl,xc-ofl];
		xcary.sort();
		ctx.fillRect(xcary[0],0,(xcary[1]-xcary[0]),t_.hei_);
		return false;
	}
	if(t_.drawdone&& (t_.xhili||t_.yhili))
	{	if(t_.excanvflag&& t_.xloopn>=t_.loopbrk)
		{	if(t_.mvtimer){clearTimeout(t_.mvtimer);}
			t_.mvtimer=setTimeout(function(e){t_.hili_update(xc,yc);delete(t_.mvtimer);},t_.movewait);
		}else
		{	t_.hili_update(xc,yc);
		}
	}return false;
};
SLLG.prototype.hili_update=function(xc,yc)
{	var t_=this,xupdflag=false,msstart=(new Date()).getTime(),dobj=new Date(),ud;
	if(!t_.xhili&& !t_.yhili){return true;}
	if(xc==ud)
	{	if(t_.xlastmove!=ud)
		{	xc=t_.xlastmove;
		}else
		{	xc=t_.xval2cord(t_.xaxmin);
		}
	}var xvm=t_.xcord2val(xc,true),yvm=t_.ycord2val(yc);
	if(xvm>t_.xaxmax){xvm=t_.xaxmax;}
	else if(xvm<t_.xaxmin){xvm=t_.xaxmin;}
	var xvorig=xvm,multlim=Math.abs(Math.ceil(1/(t_.sclx*t_.xinc))),ydiff=Infinity;
	if(t_.xtimeflag&&t_.xinc>=30*24*3600000)
	{	xvm=SLLG.timeround(xvm,t_.xinc);
		multlim=0;
	}
	if(multlim>0)
	{	for(var m1=-multlim;m1<=multlim;m1++)
		{	var xvc=xvorig+(m1*t_.xinc);
			for(var i=0;i<t_.grpary.length;i++)
			{	var yvc=t_.getmapdata(i,xvc);
				if(!isNaN(yvc)&& ydiff>Math.abs(yvc-yvm))
				{	ydiff=Math.abs(yvc-yvm);
					xvm=xvc;
				}
			}
		}
	}var xc2=t_.xval2cord(xvm,true);
	if(!isNaN(xc2))
	{	xc2-=t_.hili_size;
	}if(t_.hilnds.length<t_.grpary.length)
	{	t_.hili_init();
	}
	for(var i=0;i<t_.grpary.length;i++)
	{	if(t_.grpary[i]==ud){continue;}
		var yv=t_.getmapdata(i,xvm);
		if(!isNaN(yv)||isNaN(t_.xincgap))
		{	xupdflag=true;
			break;
		}
	}
	var hrskipped=false;
	if(t_.xtimeflag&& (!isNaN(t_.rpthrs)||!isNaN(t_.rpthre)))
	{	dobj.setTime(xvm);
		var hrcur=dobj.getHours();
		if((!isNaN(t_.rpthrs)&& hrcur<t_.rpthrs)
			||(!isNaN(t_.rpthre)&& hrcur>t_.rpthre))
		{	hrskipped=true;
		}
	}
	for(var i=0;i<t_.grpary.length;i++)
	{	if(t_.grpary[i]==ud){continue;}
		var yv=t_.getmapdata(i,xvm);
		if(yv==ud)
		{	yv=t_['yudlbl'];
		}else if(hrskipped)
		{	 yv='hour-skipped';
		}else
		{
		}var yhilisub=t_.yhisubs[i];
		if(t_['ser_hide'][i])
		{	yv='_';
			if(t_.yhili){yhilisub.style.color='gray';}
		}else if(t_.yhili)
		{	yhilisub.style.color=t_.colors[i];
		}
		if(xupdflag)
		{	var ystr=yv;
			if(isNaN(yv))
			{	t_.hilnds[i].style.visibility='hidden';
			}else
			{	var yc=t_.yval2cord(yv)-(2*t_.hili_size);
				with(t_.hilnds[i].style){visibility='visible';left=xc2+'px';top=yc+'px';}
				if(t_.ydec&& !isNaN(t_.ydec))
				{	ystr=SLLG.rounddec(ystr,t_.ydec);
				}
			}if(t_.yhili){yhilisub.innerHTML=t_.grpary[i]+'='+ystr+', ';}
		}
	}if(xupdflag)
	{	var xstr=xvm;
		if(t_.xary)
		{	xstr=t_.xary[xvm];
		}else if(t_.xtimeflag)
		{	xstr=SLLG.timestrfmt(xvm,(t_.xsameyr?'':'y/')+'m/d h:i'+(t_.xinc<60000?':s':''));
		}if(t_.xhili)
		{	t_.xhili.innerHTML=xstr+': ';
		}
	}t_.xlastmove=xc;
	var mscur=(new Date()).getTime();
};
SLLG.prototype.drawstart=function()
{	var t_=this;
	t_.drawdone=false;

	t_.ms_start=(new Date()).getTime();
	if(t_.loadlbl)
	{	t_.loadlbl.style.display='block';
		t_.loadlbl.innerHTML='Initalizing graph';
	}t_.calcscales();
	t_.canvasinit();
	t_.drawlegend();
	t_.hili_update();
	t_.gi_=0;
	for(var k in t_['stat_arys']){t_[k]=[];}
	t_.plotdata={};
	for(var gi=0;gi<t_.grpary.length;gi++)
	{	t_.plotdata[gi]={};
		if(t_.statlbls[gi])
		{	t_.statlbls[gi].innerHTML='';
		}
	}
	if(t_.ptcanvorigs.length>0&& t_.xloopn>t_.yrecalc_limit&& !t_.iszoomed)
	{	for(var gi=0;gi<t_.ptcanvorigs.length;gi++)
		{	if(t_.excanvflag)
			{	t_.ptcanvs[gi].getContext('2d').element_.innerHTML=t_.ptcanvorigs[gi];
				continue;
			}t_.par.insertBefore(t_.ptcanvorigs[gi],t_.ptcanvs[gi]);
			t_.par.removeChild(t_.ptcanvs[gi]);
			t_.ptcanvs[gi]=t_.ptcanvorigs[gi];
			t_.ptcanvorigs[gi]=SLLG.clonecanvas(t_.ptcanvs[gi]);
		}
		for(var k in t_['stat_arys'])
		{	t_[k]=t_.stat_origs[k].slice(0);
		}
		return t_.drawend();
	}
	return t_.drawseries();
}
SLLG.prototype.drawzoom=function(x0,x1)
{	var t_=this,ud;
	t_.iszoomed=false;
	t_.xaxmin=x0;t_.xaxmax=x1;
	if(t_.xaxmin==ud||isNaN(t_.xaxmin)||t_.xaxmin<t_.xmin)
	{	t_.xaxmin=t_.xmin;
	}else
	{	t_.iszoomed=true;
	}
	if(t_.xaxmax==ud||isNaN(t_.xaxmax)||t_.xaxmax>t_.xmax)
	{	t_.xaxmax=t_.xmax;
	}else
	{	t_.iszoomed=true;
	}
	t_.xloopn=Math.ceil((t_.xaxmax-t_.xaxmin)/t_.xinc);
	if(!isNaN(t_.loopbrk)&& (isNaN(t_.yrecalc_limit)|| t_.yrecalc_limit>t_.loopbrk))
	{	t_.yrecalc_limit=t_.loopbrk;
	}
	if(!isNaN(t_.yrecalc_limit)&& t_.xloopn<=t_.yrecalc_limit
		&&((t_.ypowadjust&&!isNaN(t_.yscale))||t_.iszoomed||isNaN(t_.ymax)))
	{	t_.yminact=Infinity; t_.ymaxact=-Infinity;
		t_.gi_=0;t_.loopc=-1;
		t_.ysclac=t_.yscale;
		t_.plotdata={};
		t_.getyrange_loopx();
	}else
	{	t_.yaxmax=t_.ymax;
		if(isNaN(t_.ymin)){t_.ymin=0;}
		t_.yaxmin=t_.ymin;
		t_.drawstart();
	}
};
SLLG.prototype.calcscales=function()
{	var t_=this,ud,dobj=new Date();
	t_.lh=SLLG.getstr_wh('ZZZ',t_.par).h;
	var xmult=t_.xloopn/10;
	if(t_.xtimeflag)
	{	if(xmult%5!=0){xmult-=xmult%5;}
		var minut_ary=[60,120,360,1440,7200,10080,20160,43200,86400,525600,1052640];
		for(var ti=0;ti<minut_ary.length;ti++)
		{	var loopc2=minut_ary[ti]*60000/t_.xinc;
			if(t_.xloopn<loopc2*13&& t_.xloopn>loopc2*2)
			{	xmult=loopc2;
				break;
			}
		}
	}if(xmult<=0||t_.xary){xmult=1;}
	else if(xmult>1){xmult=Math.ceil(xmult);}
	t_.xaxinc=t_.xinc*xmult;
	if(t_.xinc==1&&t_.xaxinc<1&& !t_.xtimeflag&& !SLLG.isArray(t_.xary))
	{	t_.xaxinc=1;
	}t_.xlbmin=t_.xaxmin;
	if(t_.xtimeflag)
	{	if(t_.xaxinc<=60*60000&& t_.xaxinc>=60000)
		{	t_.xlbmin+=t_.xaxinc/2;
		}dobj=new Date();dobj.setTime(t_.xlbmin);
		t_.xlbmin=SLLG.timeround(t_.xlbmin,t_.xinc);
		if(t_.xaxmin>t_.xlbmin)
		{	t_.xaxmin=t_.xlbmin;
		}
		while(t_.xlbmin<t_.xaxmin-(t_.xaxinc/2)&& t_.xaxinc>=60000)
		{	t_.xlbmin+=t_.xaxinc;
		}
	}if(!t_.xtimeflag&& t_.xlbmin%t_.xaxinc!=0&& xmult>1)
	{	t_.xlbmin+=t_.xaxinc;
		t_.xlbmin-=(t_.xlbmin%t_.xaxinc);
	}t_.xloopn=Math.ceil((t_.xaxmax-t_.xaxmin)/t_.xinc);
	t_.ysclac=t_.yscale;
	if(isNaN(t_.ysclac)||t_.ysclac==0){t_.ysclac=1;}
	if(t_.yaxmax<t_.yaxmin)
	{	var ytmp=t_.yaxmin;
		t_.yaxmin=t_.yaxmax;
		t_.yaxmax=ytmp;
	}t_.yaxmin0=t_.yaxmin;
	t_.yaxmax0=t_.yaxmax;
	if(t_.ypowadjust)
	{	var ym1=Math.max(Math.abs(t_.yaxmin),Math.abs(t_.yaxmax));
		t_.ypowpre=SLLG.powvalstr_closestunitpre(ym1);
		if(t_.ypowpre.length>0&& SLLG.powvalstr_map[t_.ypowpre]>1)
		{	t_.ysclac=t_.ysclac*SLLG.powvalstr_map[t_.ypowpre];
		}else
		{	t_.ypowpre='';
		}
	}
	if(t_.ysclac!=1)
	{	t_.yaxmax=SLLG.rounddec(t_.yaxmax/t_.ysclac,t_.ydec);
		t_.yaxmin=SLLG.rounddec(t_.yaxmin/t_.ysclac,t_.ydec);
	}
	t_.ylblh=t_.yunit?t_.lh:0;
	t_.hei_=Math.floor(t_.par.offsetHeight-(1.5*t_.lh)-2);
	var maxpowval=Math.max(Math.abs(t_.yaxmin),Math.abs(t_.yaxmax));
	if(maxpowval==0){maxpowval=1;}
	var tpow=Math.floor(Math.log(maxpowval)/Math.log(10))-1;
	var ypowv=Math.pow(10,tpow);
	if(t_.yaxmin==t_.yaxmax)
	{	t_.yaxmin-=ypowv*10;
		t_.yaxmax+=ypowv*10;
	}
	var ymult=(t_.yaxmax-t_.yaxmin)/(7*ypowv);
	if(ymult<2*t_.lh*(t_.yaxmax-t_.yaxmin)/(ypowv*t_.hei_))
	{	ymult=Math.ceil(2*t_.lh*(t_.yaxmax-t_.yaxmin)/(ypowv*t_.hei_));
	}ymult=Math.ceil(ymult);
	if(ymult%2!=0&& ymult%5!=0&& ymult>1){ymult--;}
	t_.yaxinc=ypowv*ymult;
	t_.yaxmax-=t_.yaxmax%t_.yaxinc;
	if((t_.yaxmax0/t_.ysclac)>t_.yaxmax)
	{	t_.yaxmax+=t_.yaxinc;
	}t_.yaxmin-=(t_.yaxmin%t_.yaxinc);
	while(t_.yaxmin>t_.yaxmin0)
	{	if(t_.yaxinc%2==0)
		{	t_.yaxmin-=Math.floor(t_.yaxinc/2);
		}else
		{	t_.yaxmin-=t_.yaxinc;
		}
	}t_.yaxmin=SLLG.rounddec(t_.yaxmin,t_.ydec);
	t_.yaxmax=SLLG.rounddec(t_.yaxmax,t_.ydec);
	var minwh=SLLG.getstr_wh('Z'+t_.yaxmin,t_.par);
	var maxwh=SLLG.getstr_wh('Z'+t_.yaxmax,t_.par);
	t_.ylblw=Math.max(minwh.w,maxwh.w);
	t_.wi_=t_.par.offsetWidth-t_.ylblw-t_.ylblh-t_.yleftmargin-t_.hili_size;
	t_.scly=t_.hei_/(t_.yaxmax-t_.yaxmin);
	var w1=t_.wi_;
	if(t_.yrightmargin>0){w1-=t_.yrightmargin;}
	if(t_.xaxmin==t_.xaxmax)
	{	t_.xaxmax+=1;t_.xaxmin-=1;t_.xinc=1;
	}if(isNaN(t_.xinc))
	{	t_.xinc=1;
	}t_.sclx=w1/(t_.xaxmax-t_.xaxmin);
	if(t_.xtimeflag)
	{	t_.xsameyr=(SLLG.timestrfmt(t_.xaxmin,'y')==SLLG.timestrfmt(t_.xaxmax,'y'));
	}t_.ofstbleft=t_.ylblw+t_.ylblh+t_.yleftmargin;
	t_.ofstbtop=0;
	var pnode=t_.par;
	while(pnode&& pnode.parentNode&& pnode!=document.body&& pnode!=window&& pnode.offsetLeft==ud)
	{	pnode=pnode.parentNode;
	}t_.ofstbleft+=pnode.offsetLeft;
	t_.ofstbtop+=pnode.offsetTop;
	t_.mslast=(new Date()).getTime();
};
SLLG.prototype.canvasinit=function()
{	var t_=this;
	for(var i=0;i<t_.grpary.length;i++)
	{	if(!t_.ptcanvs[i])
		{	t_.ptcanvs[i]=document.createElement('canvas');
			t_.ptcanvs[i].className='SLLG_ptcanv';
			with(t_.ptcanvs[i].style)
			{	position='absolute';
				top='0px';zIndex=t_.zind0+i+1;
			}t_.ptcanvs[i].width=t_.wi_;
			t_.ptcanvs[i].height=t_.hei_;
			if(t_.excanvflag)
			{	t_.ptcanvs[i]=G_vmlCanvasManager.initElement(t_.ptcanvs[i]);
			}SLLG.unselectable(t_.ptcanvs[i],t_.excanvflag);
			t_.par.appendChild(t_.ptcanvs[i]);
		}var cx1=t_.ptcanvs[i].getContext('2d');
		cx1.clearRect(0,0,t_.ptcanvs[i].width,t_.ptcanvs[i].height);
		t_.ptcanvs[i].width=t_.wi_;t_.ptcanvs[i].height=t_.hei_;
		t_.ptcanvs[i].style.left=(t_.ylblw+t_.ylblh+t_.yleftmargin)+'px';
		if(t_.yavgls[i]){t_.yavgls[i].style.display='none';}
	}with(t_.mousecanv)
	{	style.left=(t_.ylblw+t_.ylblh-t_.yleftmargin)+'px';
		width=t_.wi_+(2*t_.yleftmargin);
		height=t_.hei_;
	}
};
SLLG.prototype.getyrange_loopx=function()
{	var t_=this,xv,dobj=new Date(),ud;
	if(t_['ser_hide'][t_.gi_]|| t_.grpary[t_.gi_]==ud)
	{	t_.loopc=Math.ceil(t_.xloopn);
	}do
	{	t_.loopc++;
		xv=(t_.loopc*t_.xinc)+t_.xaxmin;
		if(xv>t_.xaxmax){break;}
		if(t_.xtimeflag&& (!isNaN(t_.rpthrs)||!isNaN(t_.rpthre)))
		{	dobj.setTime(xv);
			var hrcur=dobj.getHours();
			if((!isNaN(t_.rpthrs)&& hrcur<t_.rpthrs)
				||(!isNaN(t_.rpthre)&& hrcur>t_.rpthre))
			{	continue;
			}
		}
		var yv=t_.getmapdata(t_.gi_,xv);
		if(isNaN(yv)){continue;}
		if(t_.yminact>yv){t_.yminact=yv;}
		if(t_.ymaxact<yv){t_.ymaxact=yv;}
		if(!isNaN(t_.loopbrk)&& t_.loopc%t_.loopbrk==0)
		{	if(t_.loadlbl)
			{	t_.loadlbl.innerHTML='Calculating Y axis ranges: '+Math.round(100*(t_.loopc+t_.gi_*t_.xloopn)/(t_.grpary.length*t_.xloopn))+'% done';
			}window.setTimeout(function(e){t_.getyrange_loopx();});
			break;
		}
	}while(xv<=t_.xaxmax);
	if(xv>t_.xaxmax)
	{	t_.gi_++;
		if(t_.gi_<t_.grpary.length)
		{	t_.loopc=-1;t_.getyrange_loopx();
		}else
		{	t_.yaxmin=t_.yminact*t_.ysclac;
			t_.yaxmax=t_.ymaxact*t_.ysclac;
			t_.drawstart();
		}
	}
};
SLLG.prototype.drawlegend=function()
{	var t_=this,ud;
	for(var j=0;j<t_.lgelbls.length;j++)
	{	t_.par.removeChild(t_.lgelbls[j]);
	}t_.lgelbls=[];
	var xdstr_last='',xc_endlast=-1,widthcord=t_.wi_+t_.ofstbleft;
	for(var xv=t_.xlbmin;xv<=t_.xaxmax;xv+=t_.xaxinc)
	{	if(t_.xtimeflag&&t_.xaxinc>=30*24*3600000)
		{	var xvnew=SLLG.timeround(xv,t_.xaxinc);
			xv=xvnew;
		}var xc=t_.xval2cord(xv,true);
		var xc2=xc, xstr=''+xv;
		if(t_.xary)
		{	xstr=t_.xary[xv];
		}else if(t_.xtimeflag)
		{	var fmt='h:i'+(t_.xaxinc<120000?':s':'');
			if(t_.xaxinc>=30*24*3600000)
			{	fmt='y/m';
			}else if(t_.xaxinc>=24*3600000)
			{	fmt=(t_.xsameyr?'':'y/')+'m/d';
				if(xv<=t_.xlbmin)
				{fmt='w '+fmt;}
			}else
			{	var xdstr=SLLG.timestrfmt(xv,'y/m/d');
				if(xdstr_last!=xdstr)
				{	xdstr_last=xdstr;
					fmt='w y/m/d h:i'+(t_.xaxinc<120000?':s':'');
					if(xv>t_.xlbmin)
					{	fmt=(t_.xsameyr?'':'y/')+'m/d';
					}
				}
			}
			xstr=SLLG.timestrfmt(xv,fmt);
		}var xlbl=document.createElement('span');
		xlbl.className='SLLG_xlbl';
		xlbl.innerHTML=xstr;
		var xlblw=SLLG.getstr_wh(xstr,t_.par).w;
		xc2-=xlblw/2;
		var xclflag=(xv>=t_.xaxmin);
		if(xc2<0){xc2=0;xclflag=false;}
		if(xc2<=xc_endlast)
		{	if(xc2+(xlblw/2)>xc_endlast)
			{	xc2+=(xlblw/2);
			}else if(xc2+(xlblw/3)>xc_endlast)
			{	xc2+=(xlblw/3);
			}else if(xc2+(xlblw/3)>xc_endlast)
			{	xc2+=(xlblw/3);
			}else
			{	xlbl.style.display='none'; xclflag=false;
				(widthcord-xlblw)>xc_endlast
			}
		}if(xc_endlast<xc2+xlblw+t_.xlblmargin)
		{	xc_endlast=xc2+xlblw+t_.xlblmargin;
		}with(xlbl.style)
		{	position='absolute';textAlign='center';zIndex=t_.zind0+1;
			left=xc2+'px';top=(t_.hei_+2)+'px';
			if(xc2>widthcord-xlblw)
			{
				if(widthcord>xc2){width=(widthcord-xc2)+'px';}
				overflow='hidden';whiteSpace='nowrap';
			}
		}t_.par.appendChild(xlbl);
		t_.lgelbls.push(xlbl);
		if(!isNaN(t_.gridsize)&&t_.gridsize>0&& xclflag)
		{	var xlblline=document.createElement('div');
			xlblline.className='SLLG_xlblline';
			with(xlblline.style)
			{	position='absolute';zIndex=t_.zind0+1;
				left=xc+'px';top='0px';
				width='1px';height=t_.hei_+'px';
				borderLeft=t_.gridsize+'px solid '+t_.gridcolor;
				if(t_.excanvflag){filter='Alpha(opacity='+(t_.gridopacity*100)+')';}
				else{opacity=t_.gridopacity;}
			}t_.par.appendChild(xlblline);
			t_.lgelbls.push(xlblline);
		}
	}
	if(t_.xaxmin!=t_.xlbmin&& !isNaN(t_.gridsize)&&t_.gridsize>0)
	{	var xc=t_.xval2cord(t_.xaxmin,true);
		var xlblline=document.createElement('div');
		xlblline.className='SLLG_xlblline';
		with(xlblline.style){
			position='absolute';zIndex=t_.zind0+1;
			left=xc+'px';top='0px';
			width='1px';height=t_.hei_+'px';
			borderLeft=t_.gridsize+'px solid '+t_.gridcolor;
			if(t_.excanvflag){filter='Alpha(opacity='+(t_.gridopacity*100)+')';}
			else{opacity=t_.gridopacity;}
		}t_.par.appendChild(xlblline);
		t_.lgelbls.push(xlblline);
	}

	for(var yv=t_.yaxmin;yv<=t_.yaxmax;yv=yv+t_.yaxinc)
	{	var yvl=SLLG.rounddec(yv,t_.ydec);
		var ylbl=document.createElement('span');
		ylbl.className='SLLG_ylbl';
		var yc=t_.yval2cord(yvl);
		var yc2=(yc-(t_.lh/2));
		if(yvl<=t_.yaxmin){yc2-=t_.lh/2;}
		else if(yvl>=t_.yaxmax){yc2+=t_.lh/2;}
		ylbl.innerHTML=yvl;
		with(ylbl.style){position='absolute';
		zIndex=t_.zind0+1;
		left=(t_.ylblh-3)+'px';top=yc2+'px';textAlign='right';width=t_.ylblw+'px';}
		t_.par.appendChild(ylbl);
		t_.lgelbls.push(ylbl);
		if(!isNaN(t_.gridsize)&&t_.gridsize>0)
		{	var ylblline=document.createElement('div');
			ylblline.className='SLLG_ylblline';
			with(ylblline.style)
			{	position='absolute';
				zIndex=t_.zind0+1;
				left=(t_.ylblh+t_.ylblw+t_.yleftmargin)+'px';top=yc+'px';
				width=(t_.wi_-1)+'px';height='1px';
				borderTop=t_.gridsize+'px solid '+t_.gridcolor;
				if(t_.excanvflag){filter='Alpha(opacity='+(t_.gridopacity*100)+')';}
				else{opacity=t_.gridopacity;}
			}t_.par.appendChild(ylblline);
			t_.lgelbls.push(ylblline);
		}
	}
	if(t_.yunit)
	{	t_.yunitact=t_.yunit;
		if(t_.ypowpre!=ud&& t_.ypowpre.length>0)
		{	var ypowv=SLLG.powvalstr_map[t_.ypowpre], yprechr=t_.yunit.match(/[a-z]/i),yprechr2=ud;
			if(SLLG.powvalstr_map[yprechr])
			{	ypowv*=SLLG.powvalstr_map[yprechr];
			}for(var sp in SLLG.powvalstr_map)
			{	if(SLLG.powvalstr_map[sp]==ypowv)
				{	yprechr2=sp;
					break;
				}
			}if(yprechr2!=ud)
			{	t_.yunitact=t_.yunitact.replace(/([^a-z]*)([a-z])/i,'$1'+yprechr2+(SLLG.powvalstr_map[yprechr]?'':'$2'));
			}
		}
		var m=document.createElement('span');
		m.className='SLLG_yunitlbl';
		var e='rotate(-90deg)';
		var l2=0-Math.floor((SLLG.getstr_wh(t_.yunitact).w-t_.lh)/2);
		with(m.style){position='absolute';left=l2+'px';top=(t_.hei_/2)+'px';
			color=t_.gridcolor;	zIndex=t_.zind0+1;
			transform=e;WebkitTransform=e;MozTransform=e;OTransform=e;msTransform=e;}
		if(document.documentMode!=ud&&document.documentMode<9){
			with(m.style){filter='progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';left='0px';}
		}m.innerHTML=t_.yunitact;
		t_.par.appendChild(m);
		t_.lgelbls.push(m);
	}
};
SLLG.prototype.drawseries=function()
{	var t_=this;
	t_.pathsize=0;
	t_.loopc=-1;t_.xlastdraw=Number.NaN;
	t_.drawseries_loopx();
};
SLLG.prototype.drawseries_loopx=function()
{	var t_=this,ud;
	if(t_['ser_hide'][t_.gi_]||t_.grpary[t_.gi_]==ud)
	{	t_.loopc=t_.xloopn+1;
	}
	do
	{	t_.loopc++;
		t_.drawpoint();
		if(!isNaN(t_.loopbrk)&& t_.loopc%t_.loopbrk==0)
		{	if(t_.loadlbl)
			{	t_.loadlbl.innerHTML='Drawing data points: '+Math.round(100*((t_.gi_*t_.xloopn)+t_.loopc)/(t_.grpary.length*t_.xloopn))+'% done';
			}window.setTimeout(function(e){t_.drawseries_loopx();});
			break;
		}
	}while(t_.loopc<=t_.xloopn);
	if(t_.loopc>t_.xloopn)
	{	if(!isNaN(t_.xlastdraw))
		{	t_.endpath();
		}
		var mscur=(new Date()).getTime();
		t_.mslast=(new Date()).getTime();
		if(t_.gi_<t_.grpary.length-1)
		{	t_.gi_++;
			t_.drawseries();
		}else
		{	t_.drawend();
		}
	}
};
SLLG.prototype.endpath=function()
{	var t_=this;
	var cx=t_.ptcanvs[t_.gi_].getContext('2d');
	if(cx)
	{	var xcs=t_.xval2cord(t_.xpathstart);
		if(t_.areafill)
		{	var xce=t_.xval2cord(t_.xlastdraw);
			var ycs=t_.yval2cord(t_.yaxmin);
			cx.lineTo(xce,ycs);
			cx.lineTo(xcs,ycs);
			cx.fill();
		}
		if(!isNaN(t_.xpathstart)&& t_.xpathstart==t_.xlastdraw&& t_.pathsize<2)
		{	var yvl=t_.getmapdata(t_.gi_,t_.xpathstart);
			var ycl=t_.yval2cord(yvl);
			cx.lineTo(xcs+1,ycl);
		}cx.stroke();
	}t_.pathsize=0;
	t_.xlastdraw=Number.NaN;
	t_.xpathstart=Number.NaN;
};
SLLG.prototype.drawpoint=function()
{	var t_=this,dobj=new Date(),cx1,xv,ud,nan=Number.NaN;
	if(t_.ptcanvs[t_.gi_])
	{	cx1=t_.ptcanvs[t_.gi_].getContext('2d')
	}if(cx1==ud){return;}
	xv=(t_.loopc*t_.xinc)+t_.xaxmin;
	if(xv>t_.xaxmax){return;}
	if(t_.xtimeflag&&t_.xinc>=30*24*3600000)
	{	xv=SLLG.timeround(xv,t_.xinc);
	}if(t_.xtimeflag&& (!isNaN(t_.rpthrs)||!isNaN(t_.rpthre)))
	{	dobj.setTime(xv);
		var hrcur=dobj.getHours();
		if((!isNaN(t_.rpthrs)&& hrcur<t_.rpthrs)||(!isNaN(t_.rpthre)&& hrcur>t_.rpthre))
		{	if(!isNaN(t_.xlastdraw))
			{	t_.endpath();
			}return;
		}
	}var yv=t_.getmapdata(t_.gi_,xv);
	if(t_.fillwithprev&& t_.mapdata[t_.gi_])
	{	if(isNaN(yv))
		{	yv=t_.yvprev;
			t_.plotdata[t_.gi_][xv]=yv;
		}else
		{	t_.yvprev=yv;
		}
	}
	if(!isNaN(yv))
	{	if(t_.statavg)
		{	if(t_['ser_ysum'][t_.gi_]==ud)
			{	t_['ser_ysum'][t_.gi_]=0;
			}t_['ser_ysum'][t_.gi_]+=yv;
			if(t_['ser_xcnt'][t_.gi_]==ud)
			{	t_['ser_xcnt'][t_.gi_]=0;
			}t_['ser_xcnt'][t_.gi_]++;
		}
		if(t_.statmin)
		{	if(t_['ser_minpt'][t_.gi_]==ud|| t_['ser_minpt'][t_.gi_][1]>yv)
			{	t_['ser_minpt'][t_.gi_]=[xv,yv];
			}
		}
		if(t_.statmax)
		{	if(t_['ser_maxpt'][t_.gi_]==ud|| t_['ser_maxpt'][t_.gi_][1]<yv)
			{	t_['ser_maxpt'][t_.gi_]=[xv,yv];
			}
		}
		if(t_.statpct&& !isNaN(t_.statpct))
		{	if(!t_['ser_vals'][t_.gi_]){t_['ser_vals'][t_.gi_]=[];}
			t_['ser_vals'][t_.gi_].push({'x':xv,'y':yv});
		}
		if(t_.statbench&& !isNaN(t_.statbench))
		{	if(t_['ser_benchcnt'][t_.gi_]==ud)
			{	t_['ser_benchcnt'][t_.gi_]=0;
			}if(yv*t_.ysclac>t_.statbench)
			{	t_['ser_benchcnt'][t_.gi_]++;
			}
		}
	}
	var xc=t_.xval2cord(xv), yc=t_.yval2cord(yv);
	if(!isNaN(t_.xlastdraw))
	{	if(!isNaN(t_.xincgap)&& (xv-t_.xlastdraw)>=t_.xincgap)
		{	t_.endpath();
		}else if(!isNaN(yv))
		{	cx1.lineTo(xc,yc);
			t_.pathsize++;
			t_.xlastdraw=xv;
		}
	}
	if(t_.excanvflag&& t_.pathsize>0&&t_.pathsize%SLLG.excanv_pathlim==0)
	{	t_.endpath();
	}
	if(isNaN(t_.xlastdraw)&& !isNaN(yv))
	{	cx1.beginPath();
		cx1.strokeStyle=t_.colors[t_.gi_];
		if(t_.areafill)
		{	cx1.fillStyle=t_.colors[t_.gi_];
		}cx1.lineWidth=t_.lineThickness;
		cx1.moveTo(xc,yc);
		t_.xlastdraw=xv;
		t_.xpathstart=xv;
		t_.pathsize++;
	}
};
SLLG.prototype.drawstats=function()
{	var t_=this,ud;
	var hs=3*t_.hili_size,ysz=t_.yavglsize,fmt=(t_.xsameyr?'':'y/')+'m/d h:i';
	var xc2max=t_.ylblh+t_.ylblw+t_.yleftmargin+t_.wi_-hs;
	if(t_.excanvflag){hs=2*t_.hili_size;}
	if(isNaN(ysz)){ysz=-1;}
	if(ysz>0&& t_.statcolorlines!=ud)
	{	for(var col in t_.statcolorlines)
		{	var yv=t_.statcolorlines[col];
			if(isNaN(yv)){continue;}
			if(!t_.statcol_lnodes[col])
			{	t_.statcol_lnodes[col]=document.createElement('div');
				t_.statcol_lnodes[col].className='SLLG_statline';
				with(t_.statcol_lnodes[col].style)
				{	position='absolute';
					zIndex=t_.zind0+t_.grpary.length+4;
					if(t_.excanvflag)
					{	borderTop=ysz+'px dashed '+col;
						height='0px';
					}else
					{	backgroundImage='linear-gradient(to right,'+col+' 45%,white 0%)';
						backgroundSize=(ysz*16)+'px '+(ysz/2)+'px';
						backgroundRepeat='repeat-x';
						height=(ysz/2)+'px';
					}
				}t_.par.appendChild(t_.statcol_lnodes[col]);
			}var yc2=t_.yval2cord(yv);
			with(t_.statcol_lnodes[col].style)
			{	if(yc2>=0&&yc2<=t_.hei_)
				{	display='block';
					top=yc2+'px';
					left=(t_.ylblh+t_.ylblw+t_.yleftmargin)+'px';
					width=(t_.wi_-t_.yleftmargin)+'px';
				}else
				{	display='none';
				}
			}
		}
	}else
	{	for(var col in t_.statcol_lnodes)
		{	if(!t_.statcol_lnodes[col]){continue;}
			t_.statcol_lnodes[col].style.display='none';
			t_.par.removeChild(t_.statcol_lnodes[col]);
		}t_.statcol_lnodes={};
	}
	if(!t_.statpar){return false;}
	if(t_.xary)
	{	xstr=t_.xary[xv];
	}else if(t_.xtimeflag)
	{	if(!t_.stattimenode)
		{	t_.stattimenode=document.createElement('span');
			t_.stattimenode.className='SLLG_stattime';
			t_.stattimenode.setAttribute('name','stattime');
			t_.statpar.appendChild(t_.stattimenode);
			t_.statpar.appendChild(document.createElement('br'));
		}t_.stattimenode.innerHTML=SLLG.epochrangestr(t_.xaxmin,t_.xaxmax,t_.xinc<60000);
	}
	for(var i=0;i<t_.grpary.length;i++)
	{	if(t_.grpary[i]==ud){continue;}
		if(!t_.statlbls[i])
		{	t_.statlbls[i]=document.createElement('div');
			t_.statlbls[i].className='SLLG_statlbl';
			t_.statlbls[i].setAttribute('name','statlinelbl'+i);
			with(t_.statlbls[i].style)
			{	cursor='pointer';
			}
			t_.statlbls[i].onclick=function(e)
			{	t_.toggleseries(parseFloat(this.getAttribute('name').replace(/^[^0-9]+/,'')));
			};t_.statpar.appendChild(t_.statlbls[i]);
		}
		var statline='',yavg=Number.NaN;
		if(!t_['ser_hide'][i])
		{	if(t_.statavg)
			{	yavg=t_['ser_ysum'][i]/t_['ser_xcnt'][i];
				statline+='avg='+SLLG.rounddec(yavg,t_.ydec)+' || ';
			}
			if(t_.statmax)
			{	var xstr; statline+='max=';
				if(t_['ser_maxpt'][i]==ud)
				{	statline+=ud;
				}else
				{	statline+=SLLG.rounddec(t_['ser_maxpt'][i][1],t_.ydec);
					xstr=t_['ser_maxpt'][i][0];
					if(t_.xary){xstr=t_.xary[xstr];}
					else if(t_.xtimeflag){xstr=SLLG.timestrfmt(xstr,fmt);}
				}statline+='@'+xstr+' || ';
				if(t_.stat_triglbl&& t_['ser_maxpt'][i]!=ud)
				{	var triglbl=document.createElement('div');
					triglbl.innerHTML='&#9661;';
					var xc2=t_.xval2cord(t_['ser_maxpt'][i][0],true)-Math.round(hs/2);
					if(xc2>xc2max){xc2=xc2max;}
					with(triglbl.style)
					{	position='absolute';fontWeight='bold';
						color=t_.colors[i];
						fontSize=hs+'px';width=fontSize;height=width;
						left=xc2+'px';
						top=(t_.yval2cord(t_['ser_maxpt'][i][1])- Math.round(hs/2))+'px';
					}SLLG.unselectable(triglbl,t_.excanvflag);
					t_.par.appendChild(triglbl);
					t_.lgelbls.push(triglbl);
				}
			}
			if(t_.statmin)
			{	var xstr; statline+='min=';
				if(t_['ser_minpt'][i]==ud)
				{	statline+=ud;
				}else
				{	statline+=SLLG.rounddec(t_['ser_minpt'][i][1],t_.ydec);
					xstr=t_['ser_minpt'][i][0];
					if(t_.xary){xstr=t_.xary[xstr];}
					else if(t_.xtimeflag){xstr=SLLG.timestrfmt(xstr,fmt);}
				}statline+='@'+xstr+' || ';
				if(t_.stat_triglbl&& t_['ser_minpt'][i]!=ud)
				{	var triglbl=document.createElement('div');
					triglbl.innerHTML='&#9651;';
					var xc2=t_.xval2cord(t_['ser_minpt'][i][0],true)-Math.round(hs/2);
					if(xc2>xc2max){xc2=xc2max;}
					with(triglbl.style){position='absolute';fontWeight='bold';
						color=t_.colors[i];
						fontSize=hs+'px';width=fontSize;height=width;
						left=xc2+'px';
						top=(t_.yval2cord(t_['ser_minpt'][i][1])- hs/2)+'px';
					}SLLG.unselectable(triglbl,t_.excanvflag);
					t_.par.appendChild(triglbl);
					t_.lgelbls.push(triglbl);
				}
			}
			if(t_['statpct']&& !isNaN(t_['statpct']))
			{	var valary=t_['ser_vals'][i].slice(0);
				valary.sort(function(a,b){if(a.y==b.y){return b.x-a.x;}return a.y-b.y});
				var pctind=Math.round(valary.length*t_['statpct']/100);
				statline+=t_['statpct']+'th %tile='+valary[pctind].y;
				var xstr=valary[pctind].x;
				if(t_.xary){xstr=t_.xary[xstr];}
				else if(t_.xtimeflag){xstr=SLLG.timestrfmt(xstr,fmt);}
				statline+='@'+xstr+' || ';
			}
		}
		if(statline.length>0)
		{	statline=statline.substring(0,statline.length-4);
			statline=' ('+statline+')';
			if(t_.yunit)
			{	statline+=' '+t_.yunitact;
			}t_.statlbls[i].style.color=t_.colors[i];
		}else
		{	t_.statlbls[i].style.color='gray';
		}t_.statlbls[i].innerHTML=t_.grpary[i]+':'+statline;
		if(ysz>0)
		{	if(!t_.yavgls[i])
			{	t_.yavgls[i]=document.createElement('div');
				t_.yavgls[i].className='SLLG_yavgline';
				with(t_.yavgls[i].style)
				{	position='absolute';
					zIndex=t_.zind0+i;
					backgroundColor=SLLG.getcompstyle(t_.par,'backgroundColor');
					if(t_.excanvflag)
					{	borderTop=ysz+'px dashed '+t_.colors[i];
						height='0px';
						filter='Alpha(opacity='+(t_.gridopacity*200)+')';
					}else
					{	backgroundImage='linear-gradient(to right,'+t_.colors[i]+' 45%,transparent 0%)';
						backgroundSize=(ysz*16)+'px '+(ysz/2)+'px';
						backgroundRepeat='repeat-x';
						height=(ysz/2)+'px';
						opacity=t_.gridopacity*2;
					}
				}t_.par.appendChild(t_.yavgls[i]);
			}if(isNaN(yavg))
			{	with(t_.yavgls[i].style){display='none';}
			}else
			{	var yc2=t_.yval2cord(yavg);
				with(t_.yavgls[i].style)
				{	if(yc2>=0&&yc2<=t_.hei_)
					{	display='block';
						top=yc2+'px';
						left=(t_.ylblh+t_.ylblw+t_.yleftmargin)+'px';
						width=(t_.wi_-t_.yleftmargin)+'px';
					}else{display='none';}
				}
			}
		}
	}
	if(t_.statbench&& !isNaN(t_.statbench))
	{	var benchline='% of data over ';
		if(t_.statbenchdesc)
		{	benchline+=t_.statbenchdesc;
		}else
		{	benchline+=t_.statbench;
			if(t_.yunit){benchline+=t_.yunit};
		}
		benchline+=': ';
		for(var i=0;i<t_.grpary.length;i++)
		{	benchline+= t_.grpary[i]+'='+SLLG.rounddec(100*t_['ser_benchcnt'][i]/t_['ser_xcnt'][i],t_.ydec)+'%, ';
		}if(!t_.sbnchnode)
		{	t_.sbnchnode=document.createElement('div');
			t_.sbnchnode.className='SLLG_statbench';
			t_.statpar.appendChild(t_.sbnchnode);
		}t_.sbnchnode.innerHTML=benchline;
	}
};
SLLG.prototype.drawend=function()
{	var t_=this,ud;
	t_.mslast=(new Date()).getTime();
	if(t_.loadlbl){t_.loadlbl.style.display='none';t_.loadlbl.innerHTML='';}
	if(t_.statpar){t_.drawstats();}
	if(!isNaN(t_.yrecalc_limit)&& t_.xloopn>t_.yrecalc_limit
		&&!t_.iszoomed&& t_.ptcanvorigs.length<=0)
	{	for(var gi=0;gi<t_.ptcanvs.length;gi++)
		{	if(t_.excanvflag)
			{	t_.ptcanvorigs[gi]=t_.ptcanvs[gi].getContext('2d').element_.innerHTML;
				continue;
			}t_.ptcanvorigs[gi]=SLLG.clonecanvas(t_.ptcanvs[gi]);
		}t_.stat_origs={};
		for(var k in t_['stat_arys'])
		{	t_.stat_origs[k]=t_[k].slice(0);
		}
	}
	if(t_.endfunc)
	{	t_.endfunc(t_);
	}var mscur=(new Date()).getTime();
	if(!isNaN(t_.movewait)&& t_.movewait>=0&& !t_.mousevtset)
	{	for(var evt in {'mousemove':0,'mousedown':0,'mouseup':0/*,'mousewheel':0*/})
		{	t_.evtsetup(t_.mousecanv,evt);
		}t_.mousevtset=true;
	}
	if(!isNaN(t_.resizewait)&& t_.resizewait>=0)
	{	SLLG.evtadd(window,'resize',function(e){return t_['resize_'](e);});
	}t_.drawdone=true;
};
SLLG.prototype.hili_init=function()
{	var t_=this,ud;
	t_.xhili=SLLG.getnodebyname(t_.xhili);
	t_.yhili=SLLG.getnodebyname(t_.yhili);
	for(var i=0;i<t_.grpary.length;i++)
	{	if(t_.hilnds[i]||t_.grpary[i]==ud){continue;}
		t_.hilnds[i]=document.createElement('div');
		t_.hilnds[i].className='SLLG_hilicanv';
		SLLG.unselectable(t_.hilnds[i],t_.excanvflag);
		with(t_.hilnds[i].style){position='absolute';
			userSelect='none';
			zIndex=t_.zind0+1;
			color=t_.colors[i];cursor='pointer';
			margin='0px';padding='0px';verticalAlign='top';
			width=t_.hili_size+'px';height=width;fontSize=(t_.hili_size*3)+'px';}
		t_.hilnds[i].innerHTML='&#9679;';
		t_.par.appendChild(t_.hilnds[i]);
		if(t_.yhili)
		{	var yhilisub=document.createElement('span');
			yhilisub.setAttribute('name','hilisub_'+i);
			t_.hilnds[i].className='SLLG_hilisub';
			with(yhilisub.style){cursor='pointer';whiteSpace='nowrap';display='inline-block';}
			yhilisub.onclick=function(e)
			{	t_.toggleseries(parseFloat(this.getAttribute('name').replace(/^[^0-9]+/,'')));
			};
			t_.yhili.appendChild(yhilisub);
			t_.yhisubs[i]=yhilisub;
		}
	}
};
SLLG.prototype.toggleseries=function(gi)
{	var t_=this,ud;
	if(t_['ser_hide'][gi]==ud){t_['ser_hide'][gi]=false;}
	t_['ser_hide'][gi]=!t_['ser_hide'][gi];
	t_.ptcanvs[gi].style.visibility=t_['ser_hide'][gi]?'hidden':'visible';
	if(!isNaN(t_.yrecalc_limit)&& t_.xloopn<=t_.yrecalc_limit)
	{	t_.drawzoom(t_.xaxmin,t_.xaxmax);
	}else
	{	t_.hili_update();
		t_.drawend();
	}
};
SLLG.prototype.exportdataurl=function()
{	var t_=this;
	var expcanv=document.createElement('canvas');
	expcanv.className='SLLG_exportcanv';
	if(t_.excanvflag){return false;}
	expcanv.width=t_.wi_+t_.ylblw+t_.ylblh+t_.yleftmargin;
	expcanv.height=t_.hei_+(1.5*t_.lh)+2;
	if(t_.debuglvl>=4)
	{document.body.appendChild(expcanv);}
	var expctx=expcanv.getContext('2d');
	for(var i=0;i<t_.grpary.length;i++)
	{	if(!t_.ptcanvs[i]){continue;}
		expctx.drawImage(t_.ptcanvs[i],t_.ylblw+t_.ylblh+1,0);
	}expctx.lineWidth=t_.lineThickness;
	for(var j=0;j<t_.lgelbls.length;j++)
	{	var txt=t_.lgelbls[j].innerHTML;
		var xc=t_.lgelbls[j].offsetLeft;
		var yc=t_.lgelbls[j].offsetTop;
		if(txt.length<=0)
		{	expctx.beginPath();
			expctx.strokeStyle=t_.gridcolor;
			expctx.lineWidth=t_.lineThickness;
			if(t_.lgelbls[j].offsetWidth<=2*t_.gridsize+1)
			{	expctx.moveTo(xc,1);
				expctx.lineTo(xc,t_.hei_-2);
			}else
			{	expctx.moveTo(t_.ylblw+t_.ylblh+1,yc);
				expctx.lineTo(t_.ylblw+t_.ylblh+t_.wi_-t_.yleftmargin,yc);
			}expctx.stroke();
			continue;
		}
		if(xc<0){xc=0;}
		if(yc<0){yc=0;}
		expctx.font=SLLG.getcompstyle(t_.lgelbls[j],'font');
		expctx.fillStyle=SLLG.getcompstyle(t_.lgelbls[j],'color');
		expctx.fillText(txt,xc,yc);
	}return expcanv.toDataURL();
};
SLLG.excanv_pathlim=8190;
SLLG.rounddec=function(n,p)
{	if(isNaN(p)){return n;}
	var ps=Math.pow(10,p);
	return Math.round(n*ps)/ps;
};
SLLG.stylestr2js=function(p)
{	var p2=''+p;
	var pa=p2.match(/([^-]+)(-\w)(.*)/);
	if(pa)
	{	p2=pa[1]+(pa[2].replace(/-/g,'').toUpperCase())+pa[3];
	}return p2;
};
SLLG.getcompstyle=function(el,prop)
{	var y;
	if(el.currentStyle)
	{	y=el.currentStyle[prop];
		if(!y){y=el.currentStyle[SLLG.stylestr2js(prop)];}
	}else if(window.getComputedStyle)
	{	y=document.defaultView.getComputedStyle(el);
		if(y){y=y.getPropertyValue(prop);}
	}return y;
};
SLLG.clonecanvas=function(c)
{	var nc=c.cloneNode(true);
	nc.width=c.width;
    nc.height=c.height;
	nc.getContext('2d').drawImage(c,0,0);
	return nc;
};
SLLG.getstr_wh=function(str,pnd){
	if(!str){str='A';} if(!pnd){pnd=document.body;}
	var tn=document.createElement('span');tn.innerHTML= str;
	pnd.insertBefore(tn,pnd.firstChild);
	var r={w:tn.offsetWidth,h:tn.offsetHeight};
	pnd.removeChild(tn);
	return r;
};
SLLG.mousepos=function(evt,d)
{	if(!d){d='X';}
	var c=-1, d2=(d=='X')?'Left':'Top';
	if(evt['page'+d]){c=evt['page'+d];}
	else if(evt['client'+d]){c=evt['client'+d];}
	var sc=document.documentElement['scroll'+d2];
	if(!sc){sc=document.body['scroll'+d2];}
	if(sc){c+=sc;}
	return c;
};
SLLG.evtcancel=function(a)
{	a=a?a:window.event;
	if(a.preventDefault){a.preventDefault();
	if(a.stopPropagation){a.stopPropagation();}}
	else{a.returnValue=false;a.cancelBubble=true;}
};
SLLG.evtadd=function(el,e,fn)
{	var f2=fn,ud;
	if(el==ud|| fn==ud|| !(typeof(e)).match(/^string/i))
	{	return false;
	}if(el.addEventListener)
	{	el.addEventListener(e,f2,false);
	}else if(el.attachEvent)
	{	f2=function(){return fn(window.event);};
		el.attachEvent('on'+e,f2);
	}return f2;
};
SLLG.unselectable=function(el,exc)
{ if(!el||!el.style){return el;}
	var n='none';
	with(el.style){userSelect=n;webkitUserSelect=n;MozUserSelect=n;}
	if(exc)
	{	el.setAttribute('unselectable','on');
		document.onselectstart=function(){return false;};
	}
};
SLLG.timestrfmt=function(xv,fmt)
{	if(!fmt){fmt='w y/m/d h:i:s';}
	var d=new Date();
	if(xv)
	{	d.setTime(xv);
	}var dstr=d.toString();
	var tstr=dstr.substr(dstr.indexOf(':')-2);
	if(fmt.indexOf('y')>=0)
	{	fmt=fmt.replace('y',d.getFullYear());
	}if(fmt.indexOf('m')>=0)
	{	var m1=d.getMonth()+1;
		if(m1<10){m1='0'+m1;}
		fmt=fmt.replace('m',m1);
	}if(fmt.indexOf('d')>=0)
	{	var d1=d.getDate();
		if(d1<10){d1='0'+d1;}
		fmt=fmt.replace('d',d1);
	}if(fmt.indexOf('h')>=0)
	{	fmt=fmt.replace('h',tstr.substring(0,2));
	}if(fmt.indexOf('i')>=0)
	{	fmt=fmt.replace('i',tstr.substring(3,5));
	}if(fmt.indexOf('s')>=0)
	{	fmt=fmt.replace('s',tstr.substring(6,8));
	}if(fmt.indexOf('w')>=0)
	{	fmt=fmt.replace('w',dstr.substring(0,3));
	}return fmt;
};
SLLG.timeround=function(t,tinc)
{	var d=new Date();d.setTime(t);
	if(tinc>=43200*60000)
	{	d.setDate(1);
	}if(tinc>=1440*60000){d.setHours(0);}
	else if(tinc>=120*60000)
	{	var hr1=d.getHours();hr1-=hr1%2;d.setHours(hr1);
	}if(tinc>=60*60000){d.setMinutes(0);}
	else if(tinc>=2*60000)
	{	var minu1=d.getMinutes();
		minu1-=minu1%Math.floor(tinc/60000);
		d.setMinutes(minu1);
	}if(tinc>=60000){d.setSeconds(0);}
	if(tinc>=43200*60000&& d.getTime()<t-(14*86400000))
	{	d.setMonth(d.getMonth()+1);
		d.setDate(1);
	}return d.getTime();
};

SLLG.epochrangestr=function(epochmin,epochmax,showsec)
{	var t_=this,tmpstr='',timefmt='h:i'+(showsec?':s':'');
	if(epochmin&& !isNaN(epochmin))
	{	tmpstr+=t_.timestrfmt(epochmin,'w y/m/d '+timefmt);
	}if(epochmax&& !isNaN(epochmax))
	{	tmpstr+=' ~ ';
		var dstr2=t_.timestrfmt(epochmax,'w y/m/d ');
		if(tmpstr.indexOf(dstr2)<0)
		{	tmpstr+=dstr2;
		}tmpstr+=t_.timestrfmt(epochmax,timefmt);
	}return tmpstr;
};
SLLG.powvalstr_map={'P':Math.pow(10,15),'T':Math.pow(10,12),'G':Math.pow(10,9),'M':Math.pow(10,6),'K':Math.pow(10,3),'':1,'m':Math.pow(10,-3)};
SLLG.powvalstr_closestunitpre=function(val)
{	var t_=this,unitpre='',unitpow,ud;
	if(isNaN(val)){val=parseFloat(val);}
	if(isNaN(val)){return unitpre;}
	for(var sp in t_.powvalstr_map)
	{	if(val>=t_.powvalstr_map[sp]&& (unitpow==ud||unitpow<t_.powvalstr_map[sp]))
		{	unitpow=t_.powvalstr_map[sp];
			unitpre=sp;
		}
	}return unitpre;
};
SLLG.isArray=function(b)
{	var a=''+typeof(b),ud;
	return !((a!='object'&&!(a=='function'&&typeof(b.item)=='function'))||b==ud||typeof(b.length)!='number'||b.nodeType===3);
};
SLLG.getnodebyname=function(nd)
{	var ud;
	if(nd==ud||nd.tagName){return nd;}
	if((typeof(nd)).match(/^str/i))
	{	var nd2=document.getElementById(nd);
		if(!nd2)
		{	nd2=document.getElementsByName(nd);
			if(nd2&& nd2.length>0){nd2=nd2[0];}
			else{nd2=ud;}
		}return nd2;
	}return ud;
};
