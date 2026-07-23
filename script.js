(function(){"use strict";
var _u="",_g=false;var _d="https://api-faa.my.id/faa/ai-text2img-pro";
function _q(id){return document.getElementById(id);}
function _t(m){var x=_q("toast"),y=_q("toastMsg");y.textContent=m;x.classList.add("show");clearTimeout(x._h);x._h=setTimeout(function(){x.classList.remove("show");},2800);}
function _st(){_q("mainContent").scrollTop=0;}
function _om(){_q("modalOverlay").classList.add("active");}
function _cm(){_q("modalOverlay").classList.remove("active");}
function _of(){if(!_u)return;var l=_q("lightbox"),i=_q("lightboxImg");i.src=_u;l.classList.add("active");}
function _cf(){_q("lightbox").classList.remove("active");}
function _dl(){if(!_u){_t("\u26a0\ufe0f Generate an image before downloading");return;}var a=document.createElement("a");a.href=_u;a.download="nothing_text2img_"+Date.now()+".png";a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();document.body.removeChild(a);_t("\u2b07\ufe0f Download started!");}
function _gen(){
if(_g)return;
var pr=_q("imgPrompt"),v=pr.value.trim(),btn=_q("generateBtn"),rc=_q("resultCard"),pv=_q("previewContainer"),dw=_q("downloadWrapper");
if(!v){_t("\u26a0\ufe0f Write a prompt first");pr.focus();return;}
_g=true;btn.classList.add("loading");rc.classList.add("show");dw.innerHTML="";
pv.innerHTML='<div class="brewing"><div class="brew-noise"></div><p class="brew-text">RENDERING PIXELS<span class="blink-cursor">\u258d</span></p></div>';
var url=_d+"?prompt="+encodeURIComponent(v)+"&_t="+Date.now();
var img=new Image();
img.onload=function(){
_u=url;
pv.innerHTML='<div class="image-frame"><img id="resultImg" src="'+url+'" alt="Generated image"><div class="noise-overlay"></div><button class="btn-eye" data-act="eye" aria-label="View fullscreen"><i class="ri-eye-line"></i></button></div>';
dw.innerHTML='<button class="btn-download" data-act="dl"><i class="ri-download-2-line"></i> DOWNLOAD PNG</button>';
_t("\u2705 Image generated!");
_g=false;btn.classList.remove("loading");
};
img.onerror=function(){
pv.innerHTML='<div class="preview-placeholder"><i class="ri-error-warning-fill" style="color:#ff4fa8;"></i><p>Failed to generate image</p><p style="font-size:11px;margin-top:4px;">Try again later</p></div>';
_t("\u274c Failed, try again");
_g=false;btn.classList.remove("loading");
};
img.src=url;
}
document.addEventListener("DOMContentLoaded",function(){
_q("generateBtn").addEventListener("click",_gen);
_q("btnInfo").addEventListener("click",_om);
_q("modalCloseBtn").addEventListener("click",_cm);
_q("scrollTopBtn").addEventListener("click",_st);
_q("lightboxCloseBtn").addEventListener("click",_cf);
_q("modalOverlay").addEventListener("click",function(e){if(e.target===this)_cm();});
_q("lightbox").addEventListener("click",function(e){if(e.target===this)_cf();});
_q("imgPrompt").addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();_gen();}});
_q("previewContainer").addEventListener("click",function(e){var b=e.target.closest('[data-act="eye"]');if(b)_of();});
_q("downloadWrapper").addEventListener("click",function(e){var b=e.target.closest('[data-act="dl"]');if(b)_dl();});
document.querySelectorAll(".chip").forEach(function(c){c.addEventListener("click",function(){var pr=_q("imgPrompt");pr.value=c.textContent.trim().replace(/^\S+\s/,"");pr.focus();});});
});
})();
