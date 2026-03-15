import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="bg-white border-4 border-black p-8 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4">
        <Loader2 size={48} className="animate-spin text-rose-500" />
        <h2 className="text-xl font-black uppercase tracking-widest">Processing...</h2>
      </div>
    </div>
  );
}