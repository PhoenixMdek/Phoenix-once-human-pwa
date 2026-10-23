/* Resuelve imágenes locales o enlaces directos de la CDN de la wiki. Sin descarga previa. */
(function(root){
  function remoteURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&((u.hostname==='static.wikia.nocookie.net'&&u.pathname.startsWith('/once-human/images/'))||(u.hostname==='r.res.easebar.com'&&u.pathname.startsWith('/pic/')));}catch{return false;}}
  function localURL(value){return typeof value==='string'&&(/^media\/[a-f0-9]{24}\.(png|jpg|webp|gif)$/.test(value)||/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value));}
  function resolve(id,manifest,entry){
    const local=manifest.items[id],asset=local&&manifest.assets[local.asset];
    if(asset&&localURL(asset.src))return {src:asset.src,remote:false,metadata:local};
    const metadata=entry?.image||manifest.pending?.[id]||local;
    return metadata&&remoteURL(metadata.sourceURL)?{src:metadata.sourceURL,remote:true,metadata}:null;
  }
  root.PhoenixMedia={resolve,remoteURL};if(typeof module!=='undefined')module.exports=root.PhoenixMedia;
})(globalThis);
