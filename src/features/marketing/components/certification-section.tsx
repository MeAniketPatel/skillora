"use client";

import * as React from "react";
import { Award, ShieldCheck, Share2, Search, CheckCircle } from "lucide-react";

export function CertificationSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Verifiable Authority
              </span>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Industry-Recognized Verifiable Credentials
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                Every course capstone at Skillora grants an official digital certificate. Each credential is signed cryptographically, proving your practical knowledge to global employers.
              </p>
            </div>

            {/* Verification highlights list */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-500/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Cryptographic Integrity</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                    Recruiters can audit credentials instantly via our public verification portal. No forged PDFs or manual background calls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 border border-violet-500/10">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">One-Click Sharing</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                    Instantly export credentials to LinkedIn certifications, digital resumes, or personal portfolio headers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/10">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Verified Project Artifacts</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                    The certificate detail page links directly to your final coding repository, showing recruiters exactly what you built.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Certificate Mockup */}
          <div className="lg:col-span-7 relative">
            {/* Ambient behind the certificate */}
            <div className="absolute -inset-6 rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl opacity-70" />

            {/* Certificate Outer Shell */}
            <div className="relative mx-auto max-w-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 rounded-2xl p-8 shadow-2xl hover:shadow-[0_0_50px_0_rgba(99,102,241,0.15)] transition-all duration-500 group">
              
              {/* Border lines */}
              <div className="border-[8px] border-double border-zinc-100 dark:border-zinc-900 p-8 rounded-lg flex flex-col items-center justify-between min-h-[420px] text-center space-y-6">
                
                {/* Logo top */}
                <div className="flex items-center gap-1.5 font-heading text-xs font-black tracking-widest text-zinc-400 dark:text-zinc-500">
                  <Award className="h-5 w-5 text-indigo-600 stroke-[2]" /> SKILLORA VERIFIED CREDENTIAL
                </div>

                {/* Subtitle */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">This is to certify that</p>
                  <h3 className="font-heading text-2xl font-extrabold text-zinc-900 dark:text-white">Sarah Connor</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal max-w-sm mx-auto leading-relaxed">
                    has successfully satisfied all graduation requirements and completed the certified professional curriculum in
                  </p>
                </div>

                {/* Subject name */}
                <h4 className="text-base font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent leading-snug">
                  Creative UI/UX Design Systems for Modern SaaS
                </h4>

                {/* Signature, Seal, QR details */}
                <div className="grid grid-cols-3 items-end w-full pt-8 border-t border-zinc-100 dark:border-zinc-900 text-left">
                  {/* Left Column: Sign */}
                  <div className="space-y-1 text-zinc-500 dark:text-zinc-400">
                    <span className="font-serif italic text-sm text-zinc-700 dark:text-zinc-300">Marcus Aurelius</span>
                    <p className="text-[8px] uppercase font-bold tracking-wider text-zinc-400">Lead Instructor</p>
                  </div>

                  {/* Center Column: Seal Icon */}
                  <div className="flex flex-col items-center justify-center relative">
                    <div className="h-12 w-12 rounded-full border-2 border-indigo-600/30 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 animate-[spin_20s_infinite_linear]">
                      <Award className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <CheckCircle className="h-4.5 w-4.5 text-indigo-600 fill-white dark:fill-zinc-950 stroke-[2]" />
                    </div>
                  </div>

                  {/* Right Column: QR and Code */}
                  <div className="flex flex-col items-end text-right space-y-1 text-[8px] text-zinc-400 dark:text-zinc-500">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-1 flex items-center justify-center shrink-0">
                      {/* Fake QR mini grid */}
                      <div className="grid grid-cols-4 gap-[2px] w-full h-full">
                        {Array(16).fill(0).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded-[1px] ${
                              (i * 3 + 1) % 5 === 0 || i % 3 === 0 
                                ? "bg-zinc-800 dark:bg-zinc-200" 
                                : "bg-transparent"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span>ID: SK-8392-C</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
