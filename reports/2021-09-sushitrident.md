![Sushi](/static/71a82868b7ae947367fae950372a0236/34ca5/Sushi.png)

Sushi Trident contest phase 1  
Findings & Analysis Report
==========================================================

#### 2021-11-22

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (16)](#high-risk-findings-16)
    
    *   [\[H-01\] Flash swap call back prior to transferring tokens in `indexPool`](#h-01-flash-swap-call-back-prior-to-transferring-tokens-in-indexpool)
    *   [\[H-02\] Index Pool always swap to Zero](#h-02-index-pool-always-swap-to-zero)
    *   [\[H-03\] `IndexPool` pow overflows when `weightRatio` > 10.](#h-03-indexpool-pow-overflows-when-weightratio--10)
    *   [\[H-04\] IndexPool’s `INIT_POOL_SUPPLY` is not fair.](#h-04-indexpools-init_pool_supply-is-not-fair)
    *   [\[H-05\] hybrid pool uses wrong `non_optimal_mint_fee`](#h-05-hybrid-pool-uses-wrong-non_optimal_mint_fee)
    *   [\[H-06\] `IndexPool`: Poor conversion from Balancer V1’s corresponding functions](#h-06-indexpool--poor-conversion-from-balancer-v1s-corresponding-functions)
    *   [\[H-07\] `IndexPool.mint` The first liquidity provider is forced to supply assets in the same amount, which may cause a significant amount of fund loss](#h-07-indexpoolmint-the-first-liquidity-provider-is-forced-to-supply-assets-in-the-same-amount-which-may-cause-a-significant-amount-of-fund-loss)
    *   [\[H-08\] `HybridPool`’s reserve is converted to “amount” twice](#h-08-hybridpools-reserve-is-converted-to-amount-twice)
    *   [\[H-09\] Unsafe cast in `IndexPool` mint leads to attack](#h-09-unsafe-cast-in-indexpool-mint-leads-to-attack)
    *   [\[H-10\] `IndexPool` initial LP supply computation is wrong](#h-10-indexpool-initial-lp-supply-computation-is-wrong)
    *   [\[H-11\] `ConstantProductPool.burnSingle` swap amount computations should use balance](#h-11-constantproductpoolburnsingle-swap-amount-computations-should-use-balance)
    *   [\[H-12\] absolute difference is not calculated properly when a > b in MathUtils](#h-12-absolute-difference-is-not-calculated-properly-when-a--b-in-mathutils)
    *   [\[H-13\] Overflow in the `mint` function of `IndexPool` causes LPs’ funds to be stolen](#h-13-overflow-in-the-mint-function-of-indexpool-causes-lps-funds-to-be-stolen)
    *   [\[H-14\] Incorrect usage of `_pow` in `_computeSingleOutGivenPoolIn` of `IndexPool`](#h-14-incorrect-usage-of-_pow-in-_computesingleoutgivenpoolin-of-indexpool)
    *   [\[H-15\] Incorrect multiplication in `_computeSingleOutGivenPoolIn` of `IndexPool`](#h-15-incorrect-multiplication-in-_computesingleoutgivenpoolin-of-indexpool)
    *   [\[H-16\] Funds in the pool could be stolen by exploiting `flashSwap` in `HybridPool`](#h-16-funds-in-the-pool-could-be-stolen-by-exploiting-flashswap-in-hybridpool)
*   [Medium Risk Findings (10)](#medium-risk-findings-10)
    
    *   [\[M-01\] No bar fees for `IndexPools`?](#m-01-no-bar-fees-for-indexpools)
    *   [\[M-02\] `ConstantProductPool` & `HybridPool`: Adding and removing unbalanced liquidity yields slightly more tokens than swap](#m-02-constantproductpool--hybridpool-adding-and-removing-unbalanced-liquidity-yields-slightly-more-tokens-than-swap)
    *   [\[M-03\] Router would fail when adding liquidity to index Pool](#m-03-router-would-fail-when-adding-liquidity-to-index-pool)
    *   [\[M-04\] Router’s `complexPath` percentagePaths don’t work as expected](#m-04-routers-complexpath-percentagepaths-dont-work-as-expected)
    *   [\[M-05\] `_depositToBentoBox` sometimes uses both ETH and WETH](#m-05-_deposittobentobox-sometimes-uses-both-eth-and-weth)
    *   [\[M-06\] `withdrawFromWETH` always reverts](#m-06-withdrawfromweth-always-reverts-)
    *   [\[M-07\] `HybridPool`’s `flashSwap` sends entire fee to `barFeeTo`](#m-07-hybridpools-flashswap-sends-entire-fee-to-barfeeto)
    *   [\[M-08\] Rounding errors will occur for tokens without decimals](#m-08-rounding-errors-will-occur-for-tokens-without-decimals)
    *   [\[M-09\] Approximations may finish with inaccurate values](#m-09-approximations-may-finish-with-inaccurate-values)
    *   [\[M-10\] Users are susceptible to back-running when depositing ETH to `TridenRouter`](#m-10-users-are-susceptible-to-back-running-when-depositing-eth-to-tridenrouter)
*   [Low Risk Findings (39)](#low-risk-findings-39)
*   [Non-Critical Findings (20)](#non-critical-findings-20)
*   [Gas Optimizations (25)](#gas-optimizations-25)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code 423n4 (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Sushi Trident smart contract system written in Solidity. The code contest took place between September 16—September 29 2021.

[](#wardens)Wardens
-------------------

18 Wardens contributed reports to the Sushi Trident code contest (phase 1):

1.  broccoli ([shw](https://github.com/x9453) and [jonah1005](https://twitter.com/jonah1005w))
2.  [cmichel](https://twitter.com/cmichelio)
3.  WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
4.  [0xsanson](https://github.com/0xsanson)
5.  GreyArt ([hickuphh3](https://twitter.com/HickupH) and [itsmeSTYJ](https://twitter.com/itsmeSTYJ))
6.  [0xRajeev](https://twitter.com/0xRajeev)
7.  [hack3r-0m](https://twitter.com/hack3r_0m)
8.  [pauliax](https://twitter.com/SolidityDev)
9.  [hrkrshnn](https://twitter.com/_hrkrshnn)
10.  [GalloDaSballo](https://twitter.com/gallodasballo)
11.  [gpersoon](https://twitter.com/gpersoon)
12.  [JMukesh](https://twitter.com/MukeshJ_eth)
13.  [defsec](https://twitter.com/defsec_)
14.  [nikitastupin](http://twitter.com/_nikitastupin)
15.  [t11s](https://twitter.com/transmissions11)

This contest was judged by [Alberto Cuesta Cañada](https://twitter.com/alcueca).

Final report assembled by [moneylegobatman](https://twitter.com/money_lego) and [CloudEllie](https://twitter.com/CloudEllie1).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 65 unique vulnerabilities and 110 total findings. All of the issues presented here are linked back to their original findings

Of these vulnerabilities, 16 received a risk rating in the category of HIGH severity, 10 received a risk rating in the category of MEDIUM severity, and 39 received a risk rating in the category of LOW severity.

C4 analysis also identified 20 non-critical recommendations and 25 gas optimizations.

[](#scope)Scope
===============

The code under review can be found within the [C4 Sushi Trident contest repository](https://github.com/code-423n4/2021-09-sushitrident), and is composed of 58 smart contracts written in the Solidity programming language and includes 5,556 lines of Solidity code.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

[](#high-risk-findings-16)High Risk Findings (16)
=================================================

[](#h-01-flash-swap-call-back-prior-to-transferring-tokens-in-indexpool)[\[H-01\] Flash swap call back prior to transferring tokens in `indexPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/26)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli, also found by 0xsanson and cmichel_

#### [](#impact)Impact

In the `IndexPool` contract, `flashSwap` does not work. The callback function is called prior to token transfer. The sender won’t receive tokens in the callBack function. `ITridentCallee(msg.sender).tridentSwapCallback(context);`

`Flashswap` is not implemented correctly. It may need a migration to redeploy all `indexPools` if the issue is found after main-net launch. I consider this a high-risk issue.

#### [](#proof-of-concept)Proof of Concept

[IndexPool.sol#L196-L223](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L196-L223)

    ITridentCallee(msg.sender).tridentSwapCallback(context);
    // @dev Check Trident router has sent `amountIn` for skim into pool.
    unchecked { // @dev This is safe from under/overflow - only logged amounts handled.
        require(_balance(tokenIn) >= amountIn + inRecord.reserve, "NOT_RECEIVED");
        inRecord.reserve += uint120(amountIn);
        outRecord.reserve -= uint120(amountOut);
    }
    _transfer(tokenOut, amountOut, recipient, unwrapBento);

#### [](#recommended-mitigation-steps)Recommended Mitigation Steps

    _transfer(tokenOut, amountOut, recipient, unwrapBento);
    ITridentCallee(msg.sender).tridentSwapCallback(context);
    // @dev Check Trident router has sent `amountIn` for skim into pool.
    unchecked { // @dev This is safe from under/overflow - only logged amounts handled.
        require(_balance(tokenIn) >= amountIn + inRecord.reserve, "NOT_RECEIVED");
        inRecord.reserve += uint120(amountIn);
        outRecord.reserve -= uint120(amountOut);
    }

**[maxsam4 (Sushi) commented](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/26#issuecomment-952521402):**

> Duplicate of [https://github.com/code-423n4/2021-09-sushitrident-findings/issues/157](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/157) and [https://github.com/code-423n4/2021-09-sushitrident-findings/issues/80](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/80)

[](#h-02-index-pool-always-swap-to-zero)[\[H-02\] Index Pool always swap to Zero](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/27)
--------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli, also found by 0xsanson, cmichel, and WatchPug_

#### [](#impact-1)Impact

When an Index pool is initiated with two tokens A: B and the weight rate = 1:2, then no user can buy token A with token B.

The root cause is the error in pow. It seems like the dev tries to implement [Exponentiation by squaring](https://en.wikipedia.org/wiki/Exponentiation_by_squaring). [IndexPool.sol#L286-L291](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L286-L291)

    function _pow(uint256 a, uint256 n) internal pure returns (uint256 output) {
      output = n % 2 != 0 ? a : BASE;
      for (n /= 2; n != 0; n /= 2) a = a * a;
      if (n % 2 != 0) output = output * a;
    }

There’s no bracket for `for`.

The `IndexPool` is not functional. I consider this is a high-risk issue.

#### [](#proof-of-concept-1)Proof of Concept

When we initiated the pool with 2:1.

    deployed_code = encode_abi(["address[]","uint136[]","uint256"], [
        (link.address, dai.address),
        (2*10**18,  10**18),
        10**13
    ])

No one can buy dai with link.

    # (address tokenIn, address tokenOut, address recipient, bool unwrapBento, uint256 amountIn)
    previous_balance = bento.functions.balanceOf(dai.address, admin).call()
    swap_amount =  10**18
    
    bento.functions.transfer(link.address, admin, pool.address, swap_amount).transact()
    pool.functions.swap(
        encode_abi(
            ['address', 'address', 'address', 'bool', 'uint256'],
            [link.address, dai.address, admin, False, swap_amount]
        )
    ).transact()
    current_balance = bento.functions.balanceOf(dai.address, admin).call()
    token_received = current_balance - previous_balance
    # always = 0
    print(token_received)

#### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

The brackets of `for` were missed.

    function _pow(uint256 a, uint256 n) internal pure returns (uint256 output) {
        output = n % 2 != 0 ? a : BASE;
        for (n /= 2; n != 0; n /= 2) {
            a = a * a;
            if (n % 2 != 0) output = output * a;
        }
    }

[](#h-03-indexpool-pow-overflows-when-weightratio--10)[\[H-03\] `IndexPool` pow overflows when `weightRatio` > 10.](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/28)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-2)Impact

In the `IndexPool` contract, pow is used in calculating price. ([`IndexPool.sol` L255-L266](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L255-L266)). However, Pow is easy to cause overflow. If the `weightRatio` is large (e.g. 10), there’s always overflow.

Lp providers can still provide liquidity to the pool where no one can swap. All pools need to redeploy. I consider this a high-risk issue.

#### [](#proof-of-concept-2)Proof of concept

It’s easy to trigger this bug by deploying a 1:10 `IndexPool`.

    deployed_code = encode_abi(["address[]","uint136[]","uint256"], [
        (link.address, dai.address),
        (10**18, 10 * 10**18),
        10**13
    ])
    tx_hash = master_deployer.functions.deployPool(index_pool_factory.address, deployed_code).transact()

Transactions would be reverted when buying `link` with `dai`.

#### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

The `weightRatio` is an 18 decimals number. It should be divided by `(BASE)^exp`. The scale in the contract is not consistent. Recommend the dev to check all the scales/ decimals.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/28)**

[](#h-04-indexpools-init_pool_supply-is-not-fair)[\[H-04\] IndexPool’s `INIT_POOL_SUPPLY` is not fair.](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/29)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli, also found by WatchPug_

#### [](#impact-3)Impact

The `indexPool` mint `INIT_POOL_SUPPLY` to address 0 in the constructor. However, the value of the burned lp is decided by the first lp provider. According to the formula in [`IndexPool.sol` L106](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L106).

`AmountIn = first_lp_amount / INIT_POOL_SUPPLY` and the burned lp worth = `AmountIn * (INIT_POOL_SUPPLY) / (first_lp_amount + INIT_POOL_SUPPLY)`. If a pool is not initialized with optimal parameters, it would be a great number of tokens been burn. All lp providers in the pool would receive less profit.

The optimal parameter is `10**8`. It’s likely no one would initialize with `10**8` wei in most pools. I consider this is a high-risk issue.

#### [](#proof-of-concept-3)Proof of concept

There are two scenarios that the first lp provider can do. The lp provider provides the same amount of token in both cases. However, in the first scenario, he gets about `10 ** 18 * 10**18` lp while in the other scenario he gets `100 * 10**18` lp.

    deposit_amount = 10**18
    bento.functions.transfer(link.address, admin, pool.address, deposit_amount).transact()
    bento.functions.transfer(dai.address, admin, pool.address, deposit_amount).transact()
    pool.functions.mint(encode_abi(
        ['address', 'uint256'],
        [admin, 10**8] # minimum
    )).transact()
    pool.functions.mint(encode_abi(
        ['address', 'uint256'],
        [admin, 10000000000009999 * 10** 20]
    )).transact()

    deposit_amount = 10**18
    bento.functions.transfer(link.address, admin, pool.address, deposit_amount).transact()
    bento.functions.transfer(dai.address, admin, pool.address, deposit_amount).transact()
    pool.functions.mint(encode_abi(
        ['address', 'uint256'],
        [admin, deposit_amount * 100]
    )).transact()

#### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Recommend to handle `INIT_POOL_SUPPLY` in uniswap-v2’s way. Determine an optimized parameter for the user would be a better UX design.

[](#h-05-hybrid-pool-uses-wrong-non_optimal_mint_fee)[\[H-05\] hybrid pool uses wrong `non_optimal_mint_fee`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/31)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-4)Impact

When an lp provider deposits an imbalance amount of token, a swap fee is applied. `HybridPool` uses the same `_nonOptimalMintFee` as `constantProductPool`; however, since two pools use different AMM curve, the ideal balance is not the same. ref: [`StableSwap3Pool.vy` L322-L337](https://github.com/curvefi/curve-contract/blob/master/contracts/pools/3pool/StableSwap3Pool.vy#L322-L337)

Stable swap Pools are designed for 1B+ TVL. Any issue related to pricing/fee is serious. I consider this is a high-risk issue

#### [](#proof-of-concept-4)Proof of Concept

*   [StableSwap3Pool.vy#L322-L337](https://github.com/curvefi/curve-contract/blob/master/contracts/pools/3pool/StableSwap3Pool.vy#L322-L337)
*   [HybridPool.sol#L425-L441](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L425-L441)

#### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Calculate the swapping fee based on the stable swap curve. refer to [StableSwap3Pool.vy#L322-L337](https://github.com/curvefi/curve-contract/blob/master/contracts/pools/3pool/StableSwap3Pool.vy#L322-L337).

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/31)**

[](#h-06-indexpool--poor-conversion-from-balancer-v1s-corresponding-functions)[\[H-06\] `IndexPool`: Poor conversion from Balancer V1’s corresponding functions](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/40)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by GreyArt_

##### [](#impact-5)Impact

A number of functions suffer from the erroneous conversion of Balancer V1’s implementation.

*   `_compute()` (equivalent to Balancer’s [`bpow()`](https://github.com/balancer-labs/balancer-core/blob/master/contracts/BNum.sol#L108-L126))
    
    *   `if (remain == 0) output = wholePow;` when a return statement should be used instead.
*   `_computeSingleOutGivenPoolIn()` (equivalent to Balancer’s [`_calcSingleOutGivenPoolIn()`](https://github.com/balancer-labs/balancer-core/blob/master/contracts/BMath.sol#L195-L224))
    
    *   `tokenOutRatio` should be calculated with `_compute()` instead of `_pow()`
    *   `zaz` should be calculated with `_mul()` instead of the native `*`
*   `_pow()` (equivalent to Balancer’s [`bpowi()`](https://github.com/balancer-labs/balancer-core/blob/master/contracts/BNum.sol#L89-L103))
    
    *   Missing brackets `{}` for the for loop causes a different interpretation
    *   `_mul` should be used instead of the native `*`

##### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

The fixed implementation is provided below.

    function _computeSingleOutGivenPoolIn(
      uint256 tokenOutBalance,
      uint256 tokenOutWeight,
      uint256 _totalSupply,
      uint256 _totalWeight,
      uint256 toBurn,
      uint256 _swapFee
    ) internal pure returns (uint256 amountOut) {
        uint256 normalizedWeight = _div(tokenOutWeight, _totalWeight);
        uint256 newPoolSupply = _totalSupply - toBurn;
        uint256 poolRatio = _div(newPoolSupply, _totalSupply);
        uint256 tokenOutRatio = _compute(poolRatio, _div(BASE, normalizedWeight));
        uint256 newBalanceOut = _mul(tokenOutRatio, tokenOutBalance);
        uint256 tokenAmountOutBeforeSwapFee = tokenOutBalance - newBalanceOut;
        uint256 zaz = _mul(BASE - normalizedWeight, _swapFee);
        amountOut = _mul(tokenAmountOutBeforeSwapFee, (BASE - zaz));
    }
    
    function _compute(uint256 base, uint256 exp) internal pure returns (uint256 output) {
      require(MIN_POW_BASE <= base && base <= MAX_POW_BASE, "INVALID_BASE");
    
      uint256 whole = (exp / BASE) * BASE;
      uint256 remain = exp - whole;
      uint256 wholePow = _pow(base, whole / BASE);
    
      if (remain == 0) return wholePow;
    
      uint256 partialResult = _powApprox(base, remain, POW_PRECISION);
      output = _mul(wholePow, partialResult);
    }
    
    function _pow(uint256 a, uint256 n) internal pure returns (uint256 output) {
      output = n % 2 != 0 ? a : BASE;
      for (n /= 2; n != 0; n /= 2) {
    		a = _mul(a, a);
        if (n % 2 != 0) output = _mul(output, a);
    	}
    }

**[maxsam4 (Sushi) acknowledged](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/40)**

[](#h-07-indexpoolmint-the-first-liquidity-provider-is-forced-to-supply-assets-in-the-same-amount-which-may-cause-a-significant-amount-of-fund-loss)[\[H-07\] `IndexPool.mint` The first liquidity provider is forced to supply assets in the same amount, which may cause a significant amount of fund loss](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/72)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by broccoli_

When `reserve == 0`, `amountIn` for all the tokens will be set to the same amount: `ratio`, regardless of the weights, decimals and market prices of the assets.

The first liquidity provider may not be aware of this so that it may create an arbitrage opportunity for flashbots to take a significant portion of the value of The first liquidity provider’s liquidity.

[`IndexPool.sol#L93` L105](https://github.com/sushiswap/trident/blob/6bd4c053b6213ffc612987eb565aa3813d5f0d13/contracts/pool/IndexPool.sol#L93-L105)

    /// @dev Mints LP tokens - should be called via the router after transferring `bento` tokens.
    /// The router must ensure that sufficient LP tokens are minted by using the return value.
    function mint(bytes calldata data) public override lock returns (uint256 liquidity) {
        (address recipient, uint256 toMint) = abi.decode(data, (address, uint256));
    
        uint120 ratio = uint120(_div(toMint, totalSupply));
    
        for (uint256 i = 0; i < tokens.length; i++) {
            address tokenIn = tokens[i];
            uint120 reserve = records[tokenIn].reserve;
            // @dev If token balance is '0', initialize with `ratio`.
            uint120 amountIn = reserve != 0 ? uint120(_mul(ratio, reserve)) : ratio;
            require(amountIn >= MIN_BALANCE, "MIN_BALANCE");
            // @dev Check Trident router has sent `amountIn` for skim into pool.
            unchecked {
                // @dev This is safe from overflow - only logged amounts handled.
                require(_balance(tokenIn) >= amountIn + reserve, "NOT_RECEIVED");
                records[tokenIn].reserve += amountIn;
            }
            emit Mint(msg.sender, tokenIn, amountIn, recipient);
        }
        _mint(recipient, toMint);
        liquidity = toMint;
    }

##### [](#proof-of-concept-5)Proof of Concept

Given:

*   A `IndexPool` of 99% USDT and 1% WBTC;
*   Alice is the first liquidity provider.
*   Alice transfers 1e18 WBTC and 1e18 USDT to mint 100e18 of liquidity;
*   Bob can use 100e18 USDT (~$100) to swap out most of the balance of WBTC.

##### [](#impact-6)Impact

A significant portion (>90% in the case above) of the user’s funds can be lost due to arbitrage.

##### [](#recommendation)Recommendation

Consider allowing the first liquidity provider to use custom `amountIn` values for each token or always takes the MIN\_BALANCE of each token.

[](#h-08-hybridpools-reserve-is-converted-to-amount-twice)[\[H-08\] `HybridPool`’s reserve is converted to “amount” twice](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/101)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel, also found by 0xsanson and WatchPug_

The `HybridPool`’s reserves are stored as Bento “amounts” (not Bento shares) in `_updateReserves` because `_balance()` converts the current share balance to amount balances. However, when retrieving the `reserve0/1` storage fields in `_getReserves`, they are converted to amounts a second time.

#### [](#impact-7)Impact

The `HybridPool` returns wrong reserves which affects all minting/burning and swap functions. They all return wrong results making the pool eventually economically exploitable or leading to users receiving less tokens than they should.

#### [](#poc)POC

Imagine the current Bento amount / share price being `1.5`. The pool’s Bento _share_ balance being `1000`. `_updateReserves` will store a reserve of `1.5 * 1000 = 1500`. When anyone trades using the `swap` function, `_getReserves()` is called and multiplies it by `1.5` again, leading to using a reserve of 2250 instead of 1500. A higher reserve for the output token leads to receiving more tokens as the swap output. Thus the pool lost tokens and the LPs suffer this loss.

#### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

Make sure that the reserves are in the correct amounts.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/101)**

[](#h-09-unsafe-cast-in-indexpool-mint-leads-to-attack)[\[H-09\] Unsafe cast in `IndexPool` mint leads to attack](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/77)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel, also found by cmichel and pauliax_

The `IndexPool.mint` function performs an unsafe cast of `ratio` to the `uint120` type:

    uint120 ratio = uint120(_div(toMint, totalSupply));

Note that `toMint` is chosen by the caller and when choosing `toMint = 2**120 * totalSupply / BASE`, the `ratio` variable will be `2**120` and then truncated to 0 due to the cast.

This allows an attacker to mint LP tokens for free. They just need to choose the `ratio` such that the `amountIn = ratio * reserve / BASE` variable passes the `require(amountIn >= MIN_BALANCE, "MIN_BALANCE");` check. For example, when choosing `ratio = 2**120 * totalSupply / BASE + 1e16`, an attacker has to pay 1/100th of the current reserves but heavily inflates the LP token supply.

They can then use the inflated LP tokens they received in `burn` to withdraw the entire pool reserves.

#### [](#poc-1)POC

I created [this POC](https://gist.github.com/MrToph/0c8b6b5ffac0673b2f72412cf4b0b099) that implements a hardhat test and shows how to steal the pool tokens:

#### [](#impact-8)Impact

An attacker can inflate the LP token pool supply and mint themselves a lot of LP tokens by providing almost no tokens themselves. The entire pool tokens can be stolen.

#### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Even though Solidity 0.8.x is used, type casts do not throw an error. A [`SafeCast` library](https://docs.openzeppelin.com/contracts/4.x/api/utils#SafeCast) must be used everywhere a typecast is done.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/126)**

[](#h-10-indexpool-initial-lp-supply-computation-is-wrong)[\[H-10\] `IndexPool` initial LP supply computation is wrong](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/78)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel_

The `IndexPool.constructor` function already mints `INIT_POOL_SUPPLY = 100 * 1e18 = 1e20` LP tokens to the zero address.

When trying to use the pool, someone has to provide the actual initial reserve tokens in `mint`. On the first `mint`, the pool reserves are zero and the token amount required to mint is just this `ratio` itself: `uint120 amountIn = reserve != 0 ? uint120(_mul(ratio, reserve)) : ratio;`

Note that the `amountIn` is **independent of the token** which does not make much sense. This implies that all tokens must be provided in equal “raw amounts”, regardless of their decimals and value.

#### [](#poc-2)POC

###### [](#issue-1)Issue 1

Imagine I want to create a DAI/WBTC pool. If I want to initialize the pool with 100$ of DAI, `amountIn = ratio` needs to be `100*1e18=1e20` as DAI has 18 decimals. However, I now also need to supply `1e20` of WBTC (which has 8 decimals) and I’d need to pay `1e20/1e8 * priceOfBTC`, over a quadrillion dollars to match it with the 100$ of DAI.

###### [](#issue-2)Issue 2

Even in a pool where all tokens have the same decimals and the same value, like `USDC <> USDT`, it leads to issues:

*   Initial minter calls `mint` with `toMint = 1e20` which sets `ratio = 1e20 * 1e18 / 1e20 = 1e18` and thus `amountIn = 1e18` as well. The total supply increases to `2e20`.
*   Second minter needs to pay **less** tokens to receive the same amount of `1e18` LP tokens as the first minter. This should never be the case. `toMint = 1e20` => `ratio = 1e20 * 1e18 / 2e20 = 0.5e18`. Then `amountIn = ratio * reserve / 1e18 = 0.5*reserve = 0.5e18`. They only pay half of what the first LP provider had to pay.

#### [](#impact-9)Impact

It’s unclear why it’s assumed that the pool’s tokens are all in equal value - this is _not_ a StableSwap-like pool.

Any pool that uses tokens that don’t have the same value and share the same decimals cannot be used because initial liquidity cannot be provided in an economically justifiable way.

It also leads to issues where the second LP supplier has to pay **less tokens** to receive the exact same amount of LP tokens that the initial minter receives. They can steal from the initial LP provider by burning these tokens again.

#### [](#recommended-mitigation-steps-8)Recommended Mitigation Steps

Do not mint the initial token supply to the zero address in the constructor.

Do it like Uniswap/Balancer and let the first liquidity provider provide arbitrary token amounts, then mint the initial pool supply. If `reserve == 0`, `amountIn` should just take the pool balances that were transferred to this account.

In case the initial mint to the zero address in the constructor was done to prevent the “Uniswap-attack” where the price of a single wei of LP token can be very high and price out LPs, send a small fraction of this initial LP supply (~1000) to the zero address **after** it was minted to the first supplier in `mint`.

[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/78)

[](#h-11-constantproductpoolburnsingle-swap-amount-computations-should-use-balance)[\[H-11\] `ConstantProductPool.burnSingle` swap amount computations should use balance](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/96)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel_

The `ConstantProductPool.burnSingle` function is basically a `burn` followed by a `swap` and must therefore act the same way as calling these two functions sequentially.

The token amounts to redeem (`amount0`, `amount1`) are computed on the **balance** (not the reserve). However, the swap amount is then computed on the **reserves** and not the balance. The `burn` function would have updated the `reserve` to the balances and therefore `balance` should be used here:

    amount1 += _getAmountOut(amount0, _reserve0 - amount0, _reserve1 - amount1);

> ⚠️ The same issue occurs in the `HybridPool.burnSingle`.

#### [](#impact-10)Impact

For a burn, usually the `reserve` should equal the `balance`, however if any new tokens are sent to the contract and `balance > reserve`, this function will return slightly less swap amounts.

#### [](#recommended-mitigation-steps-9)Recommended Mitigation Steps

Call `_getAmountOut` with the balances instead of the reserves: `_getAmountOut(amount0, balance0 - amount0, balance1 - amount1)`

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/96#issuecomment-947608322):**

> Please bump this to High sev. This bug can actually lead to loss of funds from the pool. The author found the right issue but failed to analyze the full impact. Regardless, I think they deserve “High” for pointing this out.

**[alcueca (judge) commented](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/96#issuecomment-950561090):**

> This is what we come to C4 for ![emoji-clap](data:image/png;base64, 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 "emoji-clap") ![emoji-clap](data:image/png;base64, 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 "emoji-clap") ![emoji-clap](data:image/png;base64, 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 "emoji-clap")

[](#h-12-absolute-difference-is-not-calculated-properly-when-a--b-in-mathutils)[\[H-12\] absolute difference is not calculated properly when a > b in MathUtils](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/139)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by hack3r-0m, also found by broccoli_

the difference is computed incorrectly when a > b. [`MathUtils.sol` L22](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/libraries/MathUtils.sol#L22)

As it only used in `within1` function, scope narrows down to where `difference(a, b) <= 1;` is exploitable.

cases where `difference(a, b) <= 1` should be true but is reported false:

*   where b = a-1 (returned value is `type(uint256).max`)

cases where `difference(a, b) <= 1` should be false but is reported true:

*   where a = `type(uint256)`.max and b = 0, it returns 1 but it should ideally return `type(uint256).max`

`within1` is used at the following locations:

*   [`HybridPool.sol` L359](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L359)
*   [`HybridPool.sol` L383](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L383)
*   [`HybridPool.sol` L413](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L413)

It is possible to decrease the denominator and increase the value of the numerator (when calculating y) using constants and input to make `within1` fail

Mitigation:

Add `else` condition to mitigate it.

    unchecked {
        if (a > b) {
            diff = a - b;
        }
        else {
            diff = b - a;
        }
    }

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/139)**

[](#h-13-overflow-in-the-mint-function-of-indexpool-causes-lps-funds-to-be-stolen)[\[H-13\] Overflow in the `mint` function of `IndexPool` causes LPs’ funds to be stolen](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/163)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli, also found by WatchPug_

#### [](#impact-11)Impact

It is possible to overflow the addition in the balance check (i.e., `_balance(tokenIn) >= amountIn + reserve`) in the mint function by setting the `amountIn` to a large amount. As a result, the attacker could gain a large number of LP tokens by not even providing any liquidity. The attacker’s liquidity would be much greater than any other LPs, causing him could effectively steal others’ funds by burning his liquidity (since the funds he receives are proportional to his liquidity).

#### [](#proof-of-concept-6)Proof of Concept

*   [mint\_overflow.js](https://gist.github.com/x9453/7a423aef223c1b86442206e3248d318c)

Referenced code:

*   [IndexPool.sol L110](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L110)

#### [](#recommended-mitigation-steps-10)Recommended Mitigation Steps

Consider removing the `uncheck` statement to prevent integer overflows from happening.

**[maxsam4 (Sushi) acknowledged](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/163#issuecomment-935750061):**

> FWIW The problem here isn’t that we used unchecked but that we didn’t cast amountIn to uint256. It’s possible to overflow uint120 but not uint256.

[](#h-14-incorrect-usage-of-_pow-in-_computesingleoutgivenpoolin-of-indexpool)[\[H-14\] Incorrect usage of `_pow` in `_computeSingleOutGivenPoolIn` of `IndexPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/165)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-12)Impact

The `_computeSingleOutGivenPoolIn` function of `IndexPool` uses the `_pow` function to calculate `tokenOutRatio` with the exponent in `WAD` (i.e., in 18 decimals of precision). However, the `_pow` function assumes that the given exponent `n` is not in `WAD`. (for example, `_pow(5, BASE)` returns `5 ** (10 ** 18)` instead of `5 ** 1`). The misuse of the `_pow` function could causes an integer overflow in the `_computeSingleOutGivenPoolIn` function and thus prevent any function from calling it.

#### [](#proof-of-concept-7)Proof of Concept

Referenced code: [IndexPool.sol#L279](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L279)

#### [](#recommended-mitigation-steps-11)Recommended Mitigation Steps

Change the `_pow` function to the `_compute` function, which supports exponents in `WAD`.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/165)**

[](#h-15-incorrect-multiplication-in-_computesingleoutgivenpoolin-of-indexpool)[\[H-15\] Incorrect multiplication in `_computeSingleOutGivenPoolIn` of `IndexPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/166)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-13)Impact

The `_computeSingleOutGivenPoolIn` function of `IndexPool` uses the raw multiplication (i.e., `*`) to calculate the `zaz` variable. However, since both `(BASE - normalizedWeight)` and `_swapFee` are in `WAD`, the `_mul` function should be used instead to calculate the correct value of `zaz`. Otherwise, `zaz` would be `10 ** 18` times larger than the expected value and causes an integer underflow when calculating `amountOut`. The incorrect usage of multiplication prevents anyone from calling the function successfully.

#### [](#proof-of-concept-8)Proof of Concept

Referenced code: [IndexPool.sol#L282](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/IndexPool.sol#L282)

#### [](#recommended-mitigation-steps-12)Recommended Mitigation Steps

Change `(BASE - normalizedWeight) * _swapFee` to `_mul((BASE - normalizedWeight), _swapFee)`.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/166)**

[](#h-16-funds-in-the-pool-could-be-stolen-by-exploiting-flashswap-in-hybridpool)[\[H-16\] Funds in the pool could be stolen by exploiting `flashSwap` in `HybridPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/167)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-14)Impact

An attacker can call the `bento.harvest` function during the callback function of a flash swap of the `HybridPool` to reduce the number of input tokens that he has to pay to the pool, as long as there is any unrealized profit in the strategy contract of the underlying asset.

#### [](#proof-of-concept-9)Proof of Concept

1.  The `HybridPool` accounts for the reserve and balance of the pool using the `bento.toAmount` function, which represents the actual amount of assets that the pool owns instead of the relative share. The value of `toAmount` could increase or decrease if the `bento.harvest` function is called (by anyone), depending on whether the strategy contract earns or loses money.
2.  Supposing that the DAI strategy contract of `Bento` has a profit not accounted for yet. To account for the profit, anyone could call `harvest` on `Bento` with the corresponding parameters, which, as a result, increases the `elastic` of the DAI token.
3.  Now, an attacker wants to utilize the unrealized profit to steal funds from a DAI-WETH hybrid pool. He calls `flashSwap` to initiate a flash swap from WETH to DAI. First, the pool transfers the corresponding amount of DAI to him, calls the `tridentSwapCallback` function on the attacker’s contract, and expects that enough DAI is received at the end.
4.  During the `tridentSwapCallback` function, the attacker calls `bento.harvest` to realize the profit of DAI. As a result, the pool’s `bento.toAmount` increases, and the amount of DAI that the attacker has to pay to the pool is decreased. The attacker could get the same amount of ETH but paying less DAI by exploiting this bug.

Referenced code:

*   [`HybridPool.sol` L218-L220](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L218-L220)
*   [`HybridPool.sol` L249-L250](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L249-L250)
*   [`HybridPool.sol` L272-L285](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/pool/HybridPool.sol#L272-L285)
*   [`BentoBoxV1Flat.sol` L1105](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/flat/BentoBoxV1Flat.sol#L1105)
*   [`BentoBoxV1Flat.sol` L786-L792](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/flat/BentoBoxV1Flat.sol#L786-L792)
*   [`BentoBoxV1Flat.sol` L264-L277](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/flat/BentoBoxV1Flat.sol#L264-L277)

#### [](#recommended-mitigation-steps-13)Recommended Mitigation Steps

Consider not using `bento.toAmount` to track the reservers and balances, but use `balanceOf` instead (as done in the other two pools).

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/167#issuecomment-935717783):**

> Stableswap needs to use `toAmount` balances rather shares to work. This issue allows skimming yield profits from the pool. There’s no user funds at risk but still an issue.
> 
> We plan on resolving this by using a fixed toElastic ratio during the whole swap.

[](#medium-risk-findings-10)Medium Risk Findings (10)
=====================================================

[](#m-01-no-bar-fees-for-indexpools)[\[M-01\] No bar fees for `IndexPools`?](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/181)
----------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0xsanson, also found by pauliax_

#### [](#impact-15)Impact

`IndexPool` doesn’t collect fees for `barFeeTo`. Since this Pool contains also a method `updateBarFee()`, probably this is an unintended behavior. Also without a fee, liquidity providers would probably ditch `ConstantProductPool` in favor of `IndexPool` (using the same two tokens with equal weights), since they get all the rewards. This would constitute an issue for the ecosystem.

#### [](#recommended-mitigation-steps-14)Recommended Mitigation Steps

Add a way to send `barFees` to `barFeeTo`, same as the other pools.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/181)**

[](#m-02-constantproductpool--hybridpool-adding-and-removing-unbalanced-liquidity-yields-slightly-more-tokens-than-swap)[\[M-02\] `ConstantProductPool` & `HybridPool`: Adding and removing unbalanced liquidity yields slightly more tokens than swap](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/34)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by GreyArt, also found by broccoli_

##### [](#impact-16)Impact

A mint fee is applied whenever unbalanced liquidity is added, because it is akin to swapping the excess token amount for the other token.

However, the current implementation distributes the minted fee to the minter as well (when he should be excluded). It therefore acts as a rebate of sorts.

As a result, it makes adding and removing liquidity as opposed to swapping directly (negligibly) more desirable. An example is given below using the Constant Product Pool to illustrate this point. The Hybrid pool exhibits similar behaviour.

##### [](#proof-of-concept-10)Proof of Concept

1.  Initialize the pool with ETH-USDC sushi pool amounts. As of the time of writing, there is roughly 53586.556 ETH and 165143020.5295 USDC.
2.  Mint unbalanced LP with 5 ETH (& 0 USDC). This gives the user `138573488720892 / 1e18` LP tokens.
3.  Burn the minted LP tokens, giving the user 2.4963 ETH and 7692.40 USDC. This is therefore equivalent to swapping 5 - 2.4963 = 2.5037 ETH for 7692.4044 USDC.
4.  If the user were to swap the 2.5037 ETH directly, he would receive 7692.369221 (0.03 USDC lesser).

##### [](#recommended-mitigation-steps-15)Recommended Mitigation Steps

The mint fee should be distributed to existing LPs first, by incrementing `_reserve0` and `_reserve1` with the fee amounts. The rest of the calculations follow after.

`ConstantProductPool`

    (uint256 fee0, uint256 fee1) = _nonOptimalMintFee(amount0, amount1, _reserve0, _reserve1);
    // increment reserve amounts with fees
    _reserve0 += uint112(fee0);
    _reserve1 += uint112(fee1);
    unchecked {
        _totalSupply += _mintFee(_reserve0, _reserve1, _totalSupply);
    }
    uint256 computed = TridentMath.sqrt(balance0 * balance1);
    ...
    kLast = computed;

`HybridPool`

    (uint256 fee0, uint256 fee1) = _nonOptimalMintFee(amount0, amount1, _reserve0, _reserve1);
    // increment reserve amounts with fees
    _reserve0 += uint112(fee0);
    _reserve1 += uint112(fee1);
    uint256 newLiq = _computeLiquidity(balance0, balance1);
    ...

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/34)**

[](#m-03-router-would-fail-when-adding-liquidity-to-index-pool)[\[M-03\] Router would fail when adding liquidity to index Pool](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/68)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-17)Impact

`TridentRouter` is easy to fail when trying to provide liquidity to an index pool.

Users would not get extra lp if they are not providing lp at the pool’s spot price. It’s the same design as uniswap v2. However, uniswap’s v2 handle’s the dirty part.

Users would not lose tokens if they use the router ([`UniswapV2Router02.sol` L61-L76](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L61-L76)).

However, the router wouldn’t stop users from transferring extra tokens ([`TridentRouter.sol` L168-L190](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/TridentRouter.sol#L168-L190)).

Second, the price would possibly change when the transaction is confirmed. This would be reverted in the index pool.

Users would either transfer extra tokens or fail. I consider this is a medium-risk issue.

#### [](#proof-of-concept-11)Proof of Concept

[TridentRouter.sol#L168-L190](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/TridentRouter.sol#L168-L190)

A possible scenario:

There’s a BTC/USD pool. BTC = 50000 USD.

1.  A user sends a transaction to transfer 1 BTC and 50000 USD.
2.  After the user send a transaction, a random bot buying BTC with USD.
3.  The transaction at step 1 is mined. Since the BTC price is not 50000 USD, the transaction fails.

#### [](#recommended-mitigation-steps-16)Recommended Mitigation Steps

Please refer to the uniswap v2 router in [`UniswapV2Router02.sol` L61-L76](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol#L61-L76)

The router should calculate the optimal parameters for users.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/68)**

[](#m-04-routers-complexpath-percentagepaths-dont-work-as-expected)[\[M-04\] Router’s `complexPath` percentagePaths don’t work as expected](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/87)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel_

The `TridentRouter.complexPath` function allows splitting a trade result into several buckets and trade them in a different pool each. The distribution is defined by the `params.percentagePath[i].balancePercentage` values:

    for (uint256 i; i < params.percentagePath.length; i++) {
        uint256 balanceShares = bento.balanceOf(params.percentagePath[i].tokenIn, address(this));
        uint256 transferShares = (balanceShares * params.percentagePath[i].balancePercentage) / uint256(10)**8;
        bento.transfer(params.percentagePath[i].tokenIn, address(this), params.percentagePath[i].pool, transferShares);
        isWhiteListed(params.percentagePath[i].pool);
        IPool(params.percentagePath[i].pool).swap(params.percentagePath[i].data);
    }

However, the base value `bento.balanceOf(params.percentagePath[i].tokenIn, address(this));` is recomputed after each iteration instead of caching it before the loop.

This leads to not all tokens being used even though the percentages add up to 100%.

#### [](#poc-3)POC

Assume I want to trade 50% DAI to WETH and the other 50% DAI to WBTC. In the first iteration, `balanceShares` is computed and then 50% of it is swapped in the first pool.

However, in the second iteration, `balanceShares` is updated again, and only 50% **of the remaining** (instead of the total) balance, i.e. 25%, is traded.

The final 25% are lost and can be skimmed by anyone afterwards.

#### [](#impact-18)Impact

Users can lose their funds using `complexPath`.

#### [](#recommended-mitigation-steps-17)Recommended Mitigation Steps

Cache the `balanceShares` value once before the second `for` loop starts.

**[sarangparikh22 (Sushi) disputed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/87#issuecomment-934546115):**

> This is not the correct way to calculate the complexPath swap parameters. For instance, if we need to swap 50% DAI to WETH and the other 50% DAI to WBTC, we would keep percentages as 50 and 100, instead of 50-50 as described above. If the user enters wrong percentages, they would loose funds.

**[alcueca (judge) commented](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/87#issuecomment-950522743):**

> The format for entering the percentages is not documented. Sustained as Sev 2 as the lack of documentation on this parameter could lead to loss of funds.

[](#m-05-_deposittobentobox-sometimes-uses-both-eth-and-weth)[\[M-05\] `_depositToBentoBox` sometimes uses both ETH and WETH](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/89)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel, also found by 0xRajeev_

The `TridentRouter._depositToBentoBox` function only uses the `ETH` in the contract if it’s higher then the desired `underlyingAmount` (`address(this).balance >= underlyingAmount)`).

Otherwise, the ETH is ignored and the function uses WETH from the user.

#### [](#impact-19)Impact

Note that the `underlyingAmount = bento.toAmount(wETH, amount, true)` is computed from the Bento share price and it might happen that it increases from the time the transaction was submitted to the time the transaction is included in a block. In that case, it might completely ignore the sent `ETH` balance from the user and in addition transfer the same amount of `WETH` from the user.

The user can lose their `ETH` deposit in the contract.

#### [](#recommended-mitigation-steps-18)Recommended Mitigation Steps

Each batch must use `refundETH` at the end.

Furthermore, we recommend still depositing `address(this).balance` ETH into Bento and if it’s less than `underlyingAmount` use `WETH` only for **the remaining token difference**.

**[maxsam4 (Sushi) acknowledged](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/89)**

[](#m-06-withdrawfromweth-always-reverts-)[\[M-06\] `withdrawFromWETH` always reverts](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/90)
-------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel_

The `TridentHelper.withdrawFromWETH` (used in `TridentRouter.unwrapWETH`) function performs a low-level call to `WETH.withdraw(amount)`.

It then checks if the return `data` length is more or equal to `32` bytes, however `WETH.withdraw` returns `void` and has a return value of `0`. Thus, the function always reverts even if `success == true`.

    function withdrawFromWETH(uint256 amount) internal {
        // @audit WETH.withdraw returns nothing, data.length always zero. this always reverts
        require(success && data.length >= 32, "WITHDRAW_FROM_WETH_FAILED");
    }

#### [](#impact-20)Impact

The `unwrapWETH` function is broken and makes all transactions revert. Batch calls to the router cannot perform any unwrapping of WETH.

#### [](#recommended-mitigation-steps-19)Recommended Mitigation Steps

Remove the `data.length >= 32` from the require and only check if `success` is true.

**[sarangparikh22 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/90)**

[](#m-07-hybridpools-flashswap-sends-entire-fee-to-barfeeto)[\[M-07\] `HybridPool`’s `flashSwap` sends entire fee to `barFeeTo`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/99)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cmichel, also found by 0xsanson_

The `HybridPool.flashSwap` function sends the entire trade fees `fee` to the `barFeeTo`. It should only send `barFee * fee` to the `barFeeTo` address.

#### [](#impact-21)Impact

LPs are not getting paid at all when this function is used. There is no incentive to provide liquidity.

#### [](#recommended-mitigation-steps-20)Recommended Mitigation Steps

The `flashSwap` function should use the same fee mechanism as `swap` and only send `barFee * fee / MAX_FEE` to the `barFeeTo`. See `_handleFee` function.

*   [maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/99)

[](#m-08-rounding-errors-will-occur-for-tokens-without-decimals)[\[M-08\] Rounding errors will occur for tokens without decimals](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/152)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Some rare tokens have 0 decimals: [https://etherscan.io/token/0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25](https://etherscan.io/token/0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25)

For these tokens, small losses of precision will be amplified by the lack of decimals.

Consider a constant product pool with 1000 of token0 (with no decimals), and 1000 of token1 (also with no decimals). Suppose I swap n= 1,2,3,4 of token0 to token1. Then my output amount of token1 will be 0,1,2,3.

If token0/1 are valuable than I will be losing 100%, 50%, 33%, 25% of my trade to rounding. Currently there is no valuable token with 0 decimals, but there may be in the future.

Rounding the final `getAmountOut` division upwards would fix this.

**[maxsam4 (Sushi) commented](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/152#issuecomment-946648813):**

> Acceptable risk. We can’t do anything if the token itself doesn’t have decimals. We don’t create synthetic assets and fractionalize such tokens ourselves.

[](#m-09-approximations-may-finish-with-inaccurate-values)[\[M-09\] Approximations may finish with inaccurate values](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/155)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0xsanson, also found by broccoli_

#### [](#impact-22)Impact

In `HybridPool.sol`, functions `_computeLiquidityFromAdjustedBalances`, `_getY` and `_getYD` may finish before approximation converge, since it’s limited by `MAX_LOOP_LIMIT` iterations. In this situation the final estimated value will still be treated as correct, even though it could be relatively inaccurate.

#### [](#recommended-mitigation-steps-21)Recommended Mitigation Steps

Consider reverting the transactions if this doesn’t occur. See [https://blog.openzeppelin.com/saddle-contracts-audit/](https://blog.openzeppelin.com/saddle-contracts-audit/) issue \[M03\], with their relative fix.

[](#m-10-users-are-susceptible-to-back-running-when-depositing-eth-to-tridenrouter)[\[M-10\] Users are susceptible to back-running when depositing ETH to `TridenRouter`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/179)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by broccoli_

#### [](#impact-23)Impact

The `_depositToBentoBox` and `_depositFromUserToBentoBox` allow users to provide ETH to the router, which is later deposited to the `bento` contract for swapping other assets or providing liquidity. However, in these two functions, the input parameter does not represent the actual amount of ETH to deposit, and users have to calculate the actual amount and send it to the router, causing a back-run vulnerability if there are ETH left after the operation.

#### [](#proof-of-concept-12)Proof of Concept

1.  A user wants to swap ETH to DAI. He calls `exactInputSingleWithNativeToken` on the router with the corresponding parameters and `params.amountIn` being 10. Before calling the function, he calculates `bento.toAmount(wETH, 10, true) = 15` and thus send 15 ETH to the router.
2.  However, at the time when his transaction is executed, `bento.toAmount(wETH, amount, true)` becomes to `14`, which could happen if someone calls `harvest` on `bento` to update the `elastic` value of the `wETH` token.
3.  As a result, only 14 ETH is transferred to the pool, and 1 ETH is left in the router. Anyone could back-run the user’s transaction to retrieve the remaining 1 ETH from the router by calling the `refundETH` function.

Referenced code: [TridentRouter.sol#L318-L351](https://github.com/sushiswap/trident/blob/9130b10efaf9c653d74dc7a65bde788ec4b354b5/contracts/TridentRouter.sol#L318-L351)

#### [](#recommended-mitigation-steps-22)Recommended Mitigation Steps

Directly push the remaining ETH to the sender to prevent any ETH left in the router.

**[maxsam4 (Sushi) confirmed](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/179#issuecomment-934388751):**

> I think it’s low risk because it’s basically arbitrage and we have protection for the user in terms of “minOutputAmount”. I will be reworking ETH handling to avoid this issue completely.

**[alcueca (judge) commented](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/179#issuecomment-950567287):**

> It’s a loss of funds, not arbitrage. It should be prevented or documented. Sustained.

[](#low-risk-findings-39)Low Risk Findings (39)
===============================================

*   [\[L-01\] unchecked use of optional function “decimals” of erc20 standards](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/4) _Submitted by hack3r-0m_
*   [\[L-02\] `ConstantProductPool` lacks zero check for maserDeployer](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/9) _Submitted by hack3r-0m_
*   [\[L-03\] HybridPool.sol lacks zero check for maserDeployer](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/10) _Submitted by hack3r-0m_
*   [\[L-04\] `TridentERC20.sol` Possible replay attacks on `permit` function in case of a future chain split](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/18) _Submitted by nikitastupin, also found by 0xRajeev, 0xsanson, broccoli, and t11s_
*   [\[L-05\] Reset cachedPool ?](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/15) _Submitted by gpersoon_
*   [\[L-06\] Missing validation of recipient argument could indefinitely lock owner role](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/23) _Submitted by defsec_
*   [\[L-07\] # Hybrid Pool underflow when a < 100](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/32) _Submitted by broccoli_
*   [\[L-08\] `HybridPool`: SwapCallback should be done regardless of data.length](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/39) _Submitted by GreyArt_
*   [\[L-09\] Missing invalid token check against pool address](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/45) _Submitted by 0xRajeev_
*   [\[L-10\] `barFee` handled incorrectly in `flashSwap` (or swap)](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/46) _Submitted by 0xRajeev_
*   [\[L-11\] Strict bound in reserve check of Hybrid Pool](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/47) _Submitted by 0xRajeev_
*   [\[L-12\] Unlocked Solidity compiler pragma is risky](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/49) _Submitted by 0xRajeev, also found by broccoli, hrkrshnn, and JMukesh_
*   [\[L-13\] Missing zero-address checks](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/52) _Submitted by 0xRajeev_
*   [\[L-14\] Missing timelock for critical contract setters of privileged roles](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/55) _Submitted by 0xRajeev_
*   [\[L-15\] Unconditional setting of boolean/address values is risky](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/56) _Submitted by 0xRajeev_
*   [\[L-16\] Timelock between new owner transfer+claim will reduce risk](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/57) _Submitted by 0xRajeev_
*   [\[L-17\] Allowing direct single-step ownership transfer even as an option is risky](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/58) _Submitted by 0xRajeev_
*   [\[L-18\] Missing contract existence check may cause silent failures of token transfers](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/59) _Submitted by 0xRajeev_
*   [\[L-19\] `IndexPool` should check that tokens are supported](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/82) _Submitted by cmichel_
*   [\[L-20\] Several low-level calls don’t check the success return value](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/91) _Submitted by cmichel_
*   [\[L-21\] `ConstantProductPool` bar fee computation seems wrong](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/94) _Submitted by cmichel_
*   [\[L-22\] `ConstantProductPool` mint liquidity computation should include fees](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/95) _Submitted by cmichel_
*   [\[L-23\] `HybridPool`’s `flashSwap` does not always call callback](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/100) _Submitted by cmichel_
*   [\[L-24\] The functions `refundETH` and `unwrapWETH` is generalized-front-runnable](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/124) _Submitted by hrkrshnn_
*   [\[L-25\] Lack of checks for address and amount in `TridentERC20._mint`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/131) _Submitted by GalloDaSballo_
*   [\[L-26\] Lack of checks for address and amount in `TridentERC20._mint`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/135) _Submitted by GalloDaSballo_
*   [\[L-27\] Lack of address validation in `MasterDeployer.setMigrator`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/140) _Submitted by GalloDaSballo_
*   [\[L-28\] Consider using solidity 0.8.8](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/141)
*   [\[L-29\] lack of input validation in `Transfer()` and `TransferFrom()`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/153) _Submitted by JMukesh_
*   [\[L-30\] `_powApprox`: unbounded loop and meaning](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/162) _Submitted by 0xsanson_
*   [\[L-31\] `HybridPool`’s wrong amount to balance conversion](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/164) _Submitted by 0xsanson_
*   [\[L-32\] `_computeLiquidityFromAdjustedBalances` order of operations can be improved](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/173) _Submitted by 0xsanson_
*   [\[L-33\] Wrong initialization of `blockTimestampLast` in `ConstantProductPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/180) _Submitted by broccoli_
*   [\[L-34\] Oracle Initialization](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/149)
*   [\[L-35\] Docs disagrees with index pool code](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/184)
*   [\[L-36\] Division by zero in `_computeLiquidityFromAdjustedBalances` of `HybridPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/185) _Submitted by broccoli_
*   [\[L-37\] `_getY` and `_getYD` math operations can be reordered](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/174) _Submitted by 0xsanson_
*   [\[L-38\] Division and division in `_getY` of `HybridPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/188) _Submitted by broccoli_
*   [\[L-39\] Incorrect comparison in the `_updateReserves` function of `HybridPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/190) _Submitted by broccoli_

[](#non-critical-findings-20)Non-Critical Findings (20)
=======================================================

*   [\[N-01\] Events not emitted while changing state variables in constructor](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/2) _Submitted by hack3r-0m_
*   [\[N-02\] `ConstantProductPool`: Move minting of MIN\_LIQUIDITY after checks](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/35) _Submitted by GreyArt_
*   [\[N-03\] Unused constants could indicate missing logic or redundant code](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/43) _Submitted by 0xRajeev, also found by GreyArt_
*   [\[N-04\] `TridentRouter.isWhiteListed()` Misleading name](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/76) _Submitted by WatchPug_
*   [\[N-05\] TridentERC20 does not emit Approval event in `transferFrom`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/86) _Submitted by cmichel_
*   [\[N-06\] `ConstantProductPool.getAmountOut` does not verify token](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/93) _Submitted by cmichel_
*   [\[N-07\] `HybridPool` missing positive token amount checks for initial mint](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/97) _Submitted by cmichel_
*   [\[N-08\] `MAX_FEE_SQUARE` dependency on `MAX_FEE`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/104) _Submitted by pauliax_
*   [\[N-09\] Emit events when setting the values in constructor](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/105) _Submitted by pauliax_
*   [\[N-10\] Inclusive check of `type(uint128).max`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/107) _Submitted by pauliax_
*   [\[N-11\] Consider avoiding low level calls to MasterDeployer](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/121) _Submitted by hrkrshnn_
*   [\[N-12\] Functions that can be made external](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/122) _Submitted by hrkrshnn_
*   [\[N-13\] Style issues](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/127) _Submitted by pauliax_
*   [\[N-14\] Lack of address validation in `MasterDeployer.addToWhitelist`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/138) _Submitted by GalloDaSballo_
*   [\[N-15\] Using interfaces instead of selectors is best practice](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/150)
*   [\[N-16\] Follow Curve’s convention: `_getYD` and `_getY`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/156) _Submitted by 0xsanson_
*   [\[N-17\] View functions in Hybrid Pool Contract Pool need better documentation](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/175)
*   [\[N-18\] Inconsistent tokens sent to `barFeeTo`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/177) _Submitted by 0xsanson_
*   [\[N-19\] Unnecessary condition on `_processSwap` of `HybridPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/189) _Submitted by broccoli_
*   [\[N-20\] Similarly initialized weight thresholds may cause unexpected deployment failures](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/48) _Submitted by 0xRajeev_

[](#gas-optimizations-25)Gas Optimizations (25)
===============================================

*   [\[G-01\] Safe gas on `_powApprox`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/12) _Submitted by gpersoon_
*   [\[G-02\] Use parameter `_blockTimestampLast` in `_update()`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/16) _Submitted by gpersoon, also found by 0xsanson_
*   [\[G-03\] Consider unlocking pool only upon initial mint](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/33) _Submitted by GreyArt_
*   [\[G-04\] `ConstantProductPool`: Unnecessary mod before casting to uint32](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/37) _Submitted by GreyArt_
*   [\[G-05\] `IndexPool`: Redundant MAX\_WEIGHT](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/41) _Submitted by GreyArt_
*   [\[G-06\] `TridentOwnable`: `pendingOwner` should be set to address(1) if direct owner transfer is used](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/42) _Submitted by GreyArt_
*   [\[G-07\] Replace multiple calls with a single new function call](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/60) _Submitted by 0xRajeev_
*   [\[G-08\] Unused code can be removed to save gas](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/61) _Submitted by 0xRajeev_
*   [\[G-09\] Use of unchecked can save gas where computation is known to be overflow/underflow safe](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/62) _Submitted by 0xRajeev_
*   [\[G-10\] Gas: `HybridPool._computeLiquidityFromAdjustedBalances` should return early](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/103) _Submitted by cmichel, also found by 0xRajeev_
*   [\[G-11\] Avoiding initialization of loop index can save a little gas](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/64) _Submitted by 0xRajeev_
*   [\[G-12\] Caching in local variables can save gas](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/65) _Submitted by 0xRajeev_
*   [\[G-13\] Gas: `HybridPool` unnecessary `balance` computations](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/102) _Submitted by cmichel_
*   [\[G-14\] Use of `ecrecover` is susceptible to signature malleability](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/51) _Submitted by 0xRajeev_
*   [\[G-15\] Caching the length in for loops](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/112) _Submitted by hrkrshnn_
*   [\[G-16\] Consider using custom errors instead of revert strings](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/113) _Submitted by hrkrshnn_
*   [\[G-17\] Consider changing the `_deployData` architecture](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/114) _Submitted by hrkrshnn_
*   [\[G-18\] Caching the storage read to `tokens.length`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/115) _Submitted by hrkrshnn_
*   [\[G-19\] Caching a storage load in TridentERC20](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/116) _Submitted by hrkrshnn_
*   [\[G-20\] Unused state variable `barFee` and \_barFeeTo in `IndexPool`](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/117) _Submitted by hrkrshnn_
*   [\[G-21\] Consider putting some parts of `_div` in unchecked](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/118) _Submitted by hrkrshnn_
*   [\[G-22\] Use `calldata` instead of `memory` for function parameters](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/119) _Submitted by hrkrshnn_
*   [\[G-23\] Cache array length in for loops can save gas](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/128) _Submitted by WatchPug_
*   [\[G-24\] Cache storage variable in the stack can save gas](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/129) _Submitted by WatchPug_
*   [\[G-25\] Using 10\*\*X for constants isn’t gas efficient](https://github.com/code-423n4/2021-09-sushitrident-findings/issues/148)

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }