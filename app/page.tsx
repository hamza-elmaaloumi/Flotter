"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from './providers/UserProvider'
import Link from 'next/link'
type Card = {
	id: string
	imageUrl?: string | null
	sentences: string[]
	nextReviewAt: string
}
/**
StatCard Component
Implements "card" component specs from Design System
*/
function StatCard({ label, value, loading }: { label: string; value: React.ReactNode; loading?: boolean }) {
	return (
		<div
			className="group transition-all duration-300"
			style={{
				background: "rgba(24, 24, 27, 0.6)",
				border: "1px solid rgba(63, 63, 70, 0.4)",
				borderRadius: "24px",
				padding: "24px",
				backdropFilter: "blur(20px)",
				boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
			}}
		>
			<p style={{
				fontSize: "10px",
				fontWeight: "600",
				letterSpacing: "0.2em",
				textTransform: "uppercase",
				color: "#71717A",
				margin: 0
			}}>
				{label}
			</p>
			<p className="mt-2" style={{
				fontSize: "28px",
				fontWeight: "700",
				fontFamily: "Cal Sans, Inter, sans-serif",
				color: loading ? "#27272A" : "#FAFAFA",
				margin: 0
			}}>
				{loading ? '—' : value}
			</p>
		</div>
	)
}
export default function Home() {
	const { user } = useUser()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<any | null>(null)
	const [expandedId, setExpandedId] = useState<string | null>(null)
	useEffect(() => {
		async function fetchDash() {
			if (!user?.id) return
			setLoading(true)
			setError(null)
			try {
				const res = await axios.get('/api/cards/dash', { params: { userId: user.id } })
				setData(res.data)
			} catch (e: any) {
				console.error(e)
				setError(e?.response?.data?.error || 'Unable to load dashboard')
			} finally {
				setLoading(false)
			}
		}
		fetchDash()
	}, [user?.id])
	// Theme Constants
	const theme = {
		bg: "#0A0A0B",
		emerald: "#10B981",
		emeraldHover: "#34D399",
		textPrimary: "#FAFAFA",
		textSecondary: "#A1A1AA",
		fontSans: "Inter, system-ui, sans-serif",
		fontDisplay: "Cal Sans, Inter, sans-serif"
	}
	return (
		<div className="min-h-screen selection:bg-emerald-500/30" style={{ backgroundColor: theme.bg, color: theme.textPrimary, fontFamily: theme.fontSans }}>
			{/* Subtle Top Glow Pattern */}
			<div style={{
				position: 'absolute', top: 0, left: 0, right: 0, height: '400px',
				background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
				pointerEvents: 'none'
			}} />
			<div className="max-w-6xl mx-auto px-8 py-16 relative z-10">

				{/* Header Section */}
				<header className="flex items-end justify-between mb-12">
					<div>
						<h1 style={{
							fontFamily: theme.fontDisplay,
							fontSize: "36px",
							fontWeight: "700",
							letterSpacing: "-0.03em",
							lineHeight: "1.2"
						}}>
							Your Dashboard
						</h1>
						<p className="mt-2" style={{ color: theme.textSecondary, fontSize: "16px" }}>
							Surgical overview of your card collection.
						</p>
					</div>

					<Link
						href="/cards/new"
						className="group flex items-center gap-2 transition-all duration-200"
						style={{
							backgroundColor: theme.emerald,
							color: "#0A0A0B",
							padding: "12px 24px",
							borderRadius: "16px",
							fontWeight: "600",
							fontSize: "14px",
							boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
						}}
					>
						<span>+</span>
						<span>New Card</span>
					</Link>
				</header>

				{/* Stats Grid */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
					<StatCard label="Total Cards" value={data?.totalCardsCount} loading={loading} />
					<StatCard label="Due for Review" value={data?.dueCardsCount} loading={loading} />
					<StatCard label="Learned" value={data?.learnedCardsCount} loading={loading} />
				</section>

				{/* Main Content */}
				<section>
					<h2 className="mb-6" style={{
						fontSize: "10px",
						fontWeight: "600",
						letterSpacing: "0.2em",
						textTransform: "uppercase",
						color: theme.textSecondary
					}}>
						Active Collection
					</h2>

					{error && (
						<div className="p-4 mb-6 rounded-xl" style={{
							background: "rgba(244, 63, 94, 0.1)",
							border: "1px solid rgba(244, 63, 94, 0.2)",
							color: "#F43F5E",
							fontSize: "14px"
						}}>
							{error}
						</div>
					)}

					<div style={{
						background: "rgba(24, 24, 27, 0.6)",
						border: "1px solid rgba(63, 63, 70, 0.4)",
						borderRadius: "24px",
						overflow: "hidden",
						backdropFilter: "blur(20px)"
					}}>
						<table className="w-full text-left border-collapse">
							<thead>
								<tr style={{ borderBottom: "1px solid rgba(63, 63, 70, 0.4)" }}>
									<th className="px-6 py-4" style={{ fontSize: "12px", fontWeight: "500", color: theme.textSecondary }}>Visual</th>
									<th className="px-6 py-4" style={{ fontSize: "12px", fontWeight: "500", color: theme.textSecondary }}>Primary Context</th>
									<th className="px-6 py-4" style={{ fontSize: "12px", fontWeight: "500", color: theme.textSecondary }}>Scheduled</th>
									<th className="px-6 py-4 text-right"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{loading && (
									<tr>
										<td colSpan={4} className="py-20 text-center">
											<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-r-2 border-transparent" />
										</td>
									</tr>
								)}

								{!loading && data?.cards?.map((c: Card) => {
									const isOpen = expandedId === c.id;
									return (
										<React.Fragment key={c.id}>
											<tr
												onClick={() => setExpandedId(isOpen ? null : c.id)}
												className="cursor-pointer transition-colors duration-150"
												style={{ backgroundColor: isOpen ? "rgba(255, 255, 255, 0.02)" : "transparent" }}
											>
												<td className="px-6 py-4">
													<div className="w-16 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
														{c.imageUrl ? (
															<img src={c.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
														) : (
															<div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">VOID</div>
														)}
													</div>
												</td>
												<td className="px-6 py-4">
													<p className="text-sm font-medium line-clamp-1" style={{ color: theme.textPrimary }}>
														{c.sentences[0] || "No context provided"}
													</p>
													<span style={{ fontSize: "11px", color: theme.textSecondary }}>
														{c.sentences.length} Unit{c.sentences.length !== 1 ? 's' : ''}
													</span>
												</td>
												<td className="px-6 py-4">
													<div className="inline-flex items-center px-2 py-1 rounded-full bg-white/5 border border-white/10" style={{ fontSize: "12px", color: theme.textSecondary }}>
														{new Date(c.nextReviewAt).toLocaleDateString()}
													</div>
												</td>
												<td className="px-6 py-4 text-right">
													<span className="transition-transform duration-300 inline-block" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', color: theme.textSecondary }}>
														↓
													</span>
												</td>
											</tr>

											{/* Expanded Surgical View */}
											{isOpen && (
												<tr>
													<td colSpan={4} className="px-8 py-8" style={{ background: "rgba(9, 9, 11, 0.4)" }}>
														<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
															<div className="md:col-span-4">
																<div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
																	{c.imageUrl ? (
																		<img src={c.imageUrl} alt="Card preview" className="w-full h-full object-cover" />
																	) : (
																		<div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 italic">No visual data</div>
																	)}
																</div>
															</div>
															<div className="md:col-span-8">
																<h4 style={{
																	fontSize: "10px",
																	fontWeight: "600",
																	letterSpacing: "0.2em",
																	textTransform: "uppercase",
																	color: theme.emerald,
																	marginBottom: "16px"
																}}>
																	Contextual Analysis
																</h4>
																<div className="space-y-4">
																	{c.sentences.map((s, i) => (
																		<p key={i} style={{
																			fontSize: "16px",
																			lineHeight: "1.6",
																			color: theme.textPrimary,
																			borderLeft: `2px solid ${i === 0 ? theme.emerald : "rgba(63, 63, 70, 0.4)"}`,
																			paddingLeft: "16px"
																		}}>
																			{s}
																		</p>
																	))}
																</div>
															</div>
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									);
								})}
							</tbody>
						</table>

						{!loading && data?.cards?.length === 0 && (
							<div className="py-20 text-center" style={{ color: theme.textSecondary }}>
								<div className="mb-4 text-4xl opacity-20">∅</div>
								<p style={{ fontSize: "14px" }}>Collection is currently empty.</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	)
}