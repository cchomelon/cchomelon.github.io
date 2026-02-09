---
layout: base.njk
title: On Turbulent Cascade
tags: post
categories: ["Physics"]
---

The usual Kolmogorov-Richardson Cascade has long been a well-received picture, a phenomenological one, not a theorem. In 3D incompressible turbulence, the forward cascade is what one typically see on average, as the nonlinear dynamics have many efficient channels moving energy downscale. But those same equations can also contain hidden channels moving energy upscale.

## Parity symmetry and helicity
Consider the incompressible Navier-Stokes for velocity $u(x,t)$:
$$
\partial_{t} \mathbf{u}+(\mathbf{u}\cdot \nabla)\mathbf{u} = -\nabla p/\rho + \nu \Delta \mathbf{u}.
$$
A transformation $g$ is a symmetry if plugging in the transformed field still satisfies the same equation. Parity is the spatial inversion,
$$
\mathcal{P}: (t, \mathbf{x}, \mathbf{u(\mathbf{x},t)}) \mapsto (t, -\mathbf{x}, -\mathbf{u}(-\mathbf{x},t)).
$$
Under this map, the equation keeps the same form. You can relabel $\mathbf{y}=-\mathbf{x}$ and $\mathbf{v}(\mathbf{y},t)=-\mathbf{u}(-\mathbf{x},t)$. So the equations themselves do not prefer left-handed or right-handed structures. This matters because if the solutions or statistics do prefer one-handedness, then that preference is not imposed by the equation; it is a property of the flow state, i.e. parity symmetry breaking (宇稱對稱破缺).

A standard scalar measuring handedness in 3D fluids is helicity.
$$
\mathcal{H} = \int_{\Omega} \mathbf{u} \cdot (\nabla \times \mathbf{u})\;dV = \int_{\Omega}\mathbf{u}\cdot \mathbf{\omega} \;dV,
$$
is the inner product of velocity and vorticity. Think of $\mathbf{\omega}$ giving the local rotation axis and strength, and $\mathbf{u}\cdot \mathbf{\omega}$ telling whether the flow tends to move along its own rotation (one-handedness) or against it.
In inviscid Euler, energy and helicity are the two classical invariants. Energy is positive definite, but helicity is sign-indefinite. Under parity, helicity changes sign,
$$
\mathcal{P}\mathcal{H}=-\mathcal{H}.
$$
So helicity is a pseudo-scalar. Hence, a nonzero net helicity signals parity breaking in the statistical sense.

For incompressible flow, $\nabla \cdot \mathbf{u}=0$ becomes $\mathbf{k}\cdot \mathbf{\hat{u}}(\mathbf{k})=0$ in Fourier space. That means each Fourier mode has only two independent components (the velocity is orthogonal to $\mathbf{k}$).

A convenient way to represent those two components, especially when thinking in spherical geometry in $\mathbf{k}$-space, is a poloidal-toroidal decomposition. One introduce a local orthonormal frame tied to $\mathbf{k}$,
1. $\mathbf{e_3} = \mathbf{k}/k$,
2. $\mathbf{e_1}\propto \mathbf{k} \times \mathbf{n}$ (toroidal),
3. $e_{2}=\mathbf{e_3} \times \mathbf{e_1}$ (poloidal),
so the incompressible mode is
$$
\hat{\mathbf{u}}(\mathbf{k})=\hat{u_{1}}\mathbf{e_1} + \hat{u_{2}}\mathbf{e_2}.
$$
Now, we have isolated the two transverse degrees of freedom in a geometrically clean basis.

The key move is to rotate from $(\mathbf{e_1},\mathbf{e_2})$ into helical basis vectors (helical Fourier decomposition),
$$
\mathbf{h^s}(\mathbf{k})=\frac{1}{\sqrt{2 }}[\mathbf{e_2}(\mathbf{k})-is\mathbf{e_1}(\mathbf{k})], s=\pm.
$$
Then any incompressible Fourier mode can be written as,
$$
\hat{\mathbf{u}}(\mathbf{k})=\hat{u}^+ (\mathbf{k}) \mathbf{h}^+ (\mathbf{k})+\hat{u}(\mathbf{k})\mathbf{h}^-(\mathbf{k}).
$$
$\mathbf{h}^\pm$ are eigenvectors of the curl operator in Fourier space,
$$
i\mathbf{k} \times \mathbf{h}^\pm = \pm k \mathbf{h}^\pm.
$$
So the $+$ and $-$ components are literally right/left circularly polarized helical waves. In this basis, the helicity density at mode $\mathbf{k}$ becomes
$$
\hat{\mathcal{H}}(\mathbf{k})=k(|\hat{u}^+|^2 - |\hat{u}^-|^2).
$$
This makes the parity question very concrete: parity symmetry breaking means one helical sector dominates.

In Fourier space, the incompressible Navier-Stokes is,
$$
(\partial_{t}+\nu k^2)\hat{u_{i}}(\mathbf{k},t)=-ik_{l}P_{ij}\sum_{p}\hat{u_{j}}(\mathbf{p},t)\hat{u}_{l}(\mathbf{k}-\mathbf{p},t),
$$
where $P_{ij}=\delta_{ij}-k_{j}k_{k}/k^2$ is the projection operator. The nonlinear term couples modes only in triads,
$$
\mathbf{k}+\mathbf{p}+\mathbf{q}=0.
$$
This triadic interaction is the fundamental unit of energy transfer across scales. When you express Navier-Stokes in the helical basis, each mode carries a sign $s=\pm$. A triad therefore has combinations of of $(s_{k},s_{p},s_{q})$. There are 8 sign combinations in principle, but symmetry reduces the essential to a smaller set,
1. Homochiral triads: $(+,+,+)$ or $(-,-,-)$
2. Heterochiral triads: mixed signs, e.g. $(+,+,-)$, etc.

Assume wavenumbers ordered by magnitude $k \leq p\leq q$. <a href="https://doi.org/10.1063/1.858309">Waleffe (1992)</a> used stability arguments to show that, in homochiral triads, the intermediate mode $p$ tends to lose energy to both $k$ and $q$, with a bias that favors transfer toward the smallest wavenumber $k$ (largest scale). These interactions are inverse-leaning. In heterochiral triads, the transfer pathways are typically consistent with the standard forward cascade, moving energy to larger wavenumbers.
The intuition is, mixing opposite handedness gives the nonlinear term more efficient routes to shred structures into smaller scales, while restricting the system to one-handedness removes many of those effificient downscale channels and leaves a route that can pump energy upscale.

Kraichnan's explanation for the 2D inverse cascade is tied to having two sign-definite inviscid invariants (energy and enstrophy). In 3D, helicity is usually sign-indefinite, so it doesn't constrain the cascade direction the same way.
But in a strongly parity-broken state where only one helical sector exists (say $\hat{u}^-=0$ everywhere), then
$$
\hat{\mathcal{H}}(\mathbf{k})=k|\hat{u}^+|^2 \geq 0
$$
becomes sign-definite. The dynamics effectively have positive energy, and also positive helicity, which can impose constraints reminiscent of the 2D situation, and therefore support an inverse transfer.

<a href="https://doi.org/10.1017/jfm.2013.637">Moffatt (2014)</a> emphasized that Waleffe's argument concerns isolated traids in the full Navier-Stokes system, triads are coupled in a dense network, so the net outcome is not guaranteed by single-triad reasoning alone.

A full triad coupling is too complex for a clean analytic proof, one can always run a numerical simulation.
Biferale, Musacchio, and Toschi (2012) performed DNS of a modified system obtained by Galerkin projecting the velocity field onto a single helical sector (keeping only $\mathbf{u}^+$ or only $\mathbf{u}^-$), it follows:
$$
\partial_{t} \mathbf{u}^s = -(\mathbf{u}^s \cdot \nabla \mathbf{u}^s - \nabla p)^s + \nu \nabla^2 \mathbf{u}^s.
$$
The resulting "homochiral Navier-Stokes" dynamics preserve only homochiral interactions. In the setup, helicity has a fixed sign, parity symmetry is explicitly broken, and the energy cascade switches from forward to fully inverse, energy injected at small scales is transported to larger scales.
Their spectra show large-scale energy growth and a Kolmogorov-like $-5/3$ scaling with the inverse transfer, while small-scale energy stays nearly unchanged, consistent with the idea that the downscale route has been largely removed.

<figure class="center-figure">
  <img src="https://ar5iv.labs.arxiv.org/html/1111.1412/assets/fig2.png" width="400">
  <figcaption><a href="https://ar5iv.labs.arxiv.org/html/1111.1412">Biferale et al., 2012</a></figcaption>
</figure>

Later numerical work suggests this inverse-cascade regime is fragile: introducing even a small fraction of heterochiral interactions can quickly restore the usual forward cascade. The switch behaves like a phase transition, only nearly pure chirality produces a robust inverse cascade. This fragility also helps explain why ordinary 3D turbulence, which naturally mixes both helicities, is dominated by forward cascade.

## (Quasi-)two-dimensional flows
Inverse cascades are well-known in flows that are 2D or nearly 2D-geophysical flows (oceans, atmosphere) or strongly anisotrpic system (e.g., rapid rotation). The natural hypothesis is,

> If a globally 3D flow develops locally quasi-2D motion, then inverse transfer can appear in those regions.

A common physical diagnostic uses low-pass filtering (LES-like). Filtering the incompressible Navier-Stokes gives an energy transfer between resolved, filtered scales and subgrid scales,
$$
\Pi = -\tilde{\tau}_{ij} \tilde{S}_{ij},
$$
where $\tilde{\tau}_{ij}=\tilde{u_{i}u_{j}} -\tilde{u_{i}}\tilde{u_{j}}$ is the subgrid stress, and $\tilde{S}_{ij}$ is the filtered strain-rate tensor. 
If we see $\Pi$ as the "inner-product" of the two tensors. Its magnitude depends strongly on their relative alignment. If we denote the eigenvalues and eigenvectors by
$$
\mathbf{eig}(\tilde{\tau}_{ij})=(\sigma_{1},\sigma_{2},\sigma_{3}), \mathbf{eig}(\tilde{S}_{ij})=(\lambda_{1},\lambda_{2},\lambda_{3}),
$$
and describe the relative rotation between their eigenframes by Euler angles $(\phi,\theta,\varphi)$, then
$$
\Pi = f(\sigma_{i},\lambda_{i},\phi,\theta,\varphi).
$$
If the eigenframes align strongly, the contraction $-\tilde{\tau}:\tilde{S}$ can be large in magnitude, hence an efficient scale-to-scale transfer, vice versa. Eddy-viscosity closures often assume $\tilde{\tau}_{ij}\propto -\tilde{S}_{ij}$, i.e. strong alignment by construction. But this assumption can artificially maximize $|\Pi|$, contributing to the tendency of such models to be over-dissipative.

In an idealized 2D limit, the strain and stress structures exhibit paired eigenvalues (e.g. $\lambda_{1}=-\lambda_{3}$), reflecting the reduced dimensionality. As the local dynamics approach this limit, the transfer geometry changes: the standard 3D downscale route becomes less effective, and backscatter or inverse transfer becomes more likely. So the quasi-2D route to inverse cascade is not "helicity-domanited," but effective reduction of degrees of freedom and a corresponding reconfiguration of how nonlinear transfer can continue.
