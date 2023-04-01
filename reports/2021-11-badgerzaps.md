![BadgerDAO](/static/8935a39f6cbc74d25107718ba8b8361c/4e333/Badger.jpg)

BadgerDAO Zaps contest  
Findings & Analysis Report
===================================================

#### 2021-01-05

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (1)](#high-risk-findings-1)
    
    *   [\[H-01\] `setGuardian()` Wrong implementation](#h-01-setguardian-wrong-implementation)
*   [Medium Risk Findings (6)](#medium-risk-findings-6)
    
    *   [\[M-01\] Improper implementation of slippage check](#m-01-improper-implementation-of-slippage-check)
    *   [\[M-02\] Missing `_token.approve()` to `curvePool` in `setZapConfig`](#m-02-missing-_tokenapprove-to-curvepool-in-setzapconfig)
    *   [\[M-03\] Zap contract’s `redeem()` function doesn’t check which token the user wants to receive](#m-03-zap-contracts-redeem-function-doesnt-check-which-token-the-user-wants-to-receive)
    *   [\[M-04\] Excessive `require` makes the transaction fail unexpectedly](#m-04-excessive-require-makes-the-transaction-fail-unexpectedly)
    *   [\[M-05\] No slippage control on `deposit` of `IbbtcVaultZap.sol`](#m-05-no-slippage-control-on-deposit-of-ibbtcvaultzapsol)
    *   [\[M-06\] `calcMint` always return poolId=0 and idx=0](#m-06-calcmint-always-return-poolid0-and-idx0)
*   [Low Risk Findings (7)](#low-risk-findings-7)
*   [Non-Critical Findings (7)](#non-critical-findings-7)
*   [Gas Optimizations (19)](#gas-optimizations-19)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of the BadgerDAO Zaps smart contract system written in Solidity. The code contest took place between November 14—November 16 2021.

[](#wardens)Wardens
-------------------

14 Wardens contributed reports to the BadgerDAO Zaps contest:

1.  WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
2.  [gzeon](https://twitter.com/gzeon)
3.  [Ruhum](https://twitter.com/0xruhum)
4.  0x0x0x
5.  [Meta0xNull](https://twitter.com/Meta0xNull)
6.  [defsec](https://twitter.com/defsec_)
7.  [pmerkleplant](https://twitter.com/merkleplant_eth)
8.  fatima\_naz
9.  ksk2345
10.  pants
11.  [ye0lde](https://twitter.com/_ye0lde)
12.  [TomFrenchBlockchain](https://github.com/TomAFrench)
13.  [GiveMeTestEther](https://twitter.com/GiveMeTestEther)

This contest was judged by [leastwood](https://twitter.com/liam_eastwood13).

Final report assembled by [moneylegobatman](https://twitter.com/money_lego) and [CloudEllie](https://twitter.com/CloudEllie1).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 14 unique vulnerabilities and 40 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 1 received a risk rating in the category of HIGH severity, 6 received a risk rating in the category of MEDIUM severity, and 7 received a risk rating in the category of LOW severity.

C4 analysis also identified 7 non-critical recommendations and 19 gas optimizations.

[](#scope)Scope
===============

The code under review can be found within the [C4 BadgerDAO Zaps contest repository](https://github.com/code-423n4/2021-11-badgerzaps), and is composed of 4 smart contracts written in the Solidity programming language.

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

[](#high-risk-findings-1)High Risk Findings (1)
===============================================

[](#h-01-setguardian-wrong-implementation)[\[H-01\] `setGuardian()` Wrong implementation](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/51)
--------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by Meta0xNull, gzeon, fatima_naz, 0x0x0x, and ksk2345\_

[`IbbtcVaultZap.sol` L116-L119](https://github.com/Badger-Finance/badger-ibbtc-utility-zaps/blob/6f700995129182fec81b772f97abab9977b46026/contracts/IbbtcVaultZap.sol#L116-L119)

    function setGuardian(address _guardian) external {
        _onlyGovernance();
        governance = _guardian;
    }

[`SettToRenIbbtcZap.sol` L130-L133](https://github.com/Badger-Finance/badger-ibbtc-utility-zaps/blob/a5c71b72222d84b6414ca0339ed1761dc79fe56e/contracts/SettToRenIbbtcZap.sol#L130-L133)

    function setGuardian(address _guardian) external {
        _onlyGovernance();
        governance = _guardian;
    }

`governance = _guardian` should be `guardian = _guardian`.

[](#medium-risk-findings-6)Medium Risk Findings (6)
===================================================

[](#m-01-improper-implementation-of-slippage-check)[\[M-01\] Improper implementation of slippage check](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/47)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by gzeon_

[`Zap.sol` L216-L238](https://github.com/Badger-Finance/ibbtc/blob/d8b95e8d145eb196ba20033267a9ba43a17be02c/contracts/Zap.sol#L216-L238)

    function redeem(IERC20 token, uint amount, uint poolId, int128 idx, uint minOut)
        external
        defend
        blockLocked
        whenNotPaused
        returns(uint out)
    {
        ibbtc.safeTransferFrom(msg.sender, address(this), amount);
    
        Pool memory pool = pools[poolId];
        if (poolId < 3) { // setts
            settPeak.redeem(poolId, amount);
            pool.sett.withdrawAll();
            pool.deposit.remove_liquidity_one_coin(pool.lpToken.balanceOf(address(this)), idx, minOut);
        } else if (poolId == 3) { // byvwbtc
            byvWbtcPeak.redeem(amount);
            IbyvWbtc(address(pool.sett)).withdraw(); // withdraws all available
        } else {
            revert("INVALID_POOL_ID");
        }
        out = token.balanceOf(address(this));
        token.safeTransfer(msg.sender, out);
    }

In the current implementation of. `Zap.sol#redeem()`, the `outAmount` of `IbyvWbtc.withdraw()` is not controlled by `minOut`.

##### [](#recommendation)Recommendation

Consider implementing the `minOut` check in between L236 and L237.

    ...
    out = token.balanceOf(address(this));
    require(out >= _minOut, "Slippage Check");
    token.safeTransfer(msg.sender, out);
    }

**[GalloDaSballo (BadgerDAO) confirmed](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/47#issuecomment-971668838):**

> Agree with the finding, not having slippage check at end means people can get rekt, we’ll add as suggested

[](#m-02-missing-_tokenapprove-to-curvepool-in-setzapconfig)[\[M-02\] Missing `_token.approve()` to `curvePool` in `setZapConfig`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/53)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug_

[`SettToRenIbbtcZap.sol` L162-L183](https://github.com/Badger-Finance/badger-ibbtc-utility-zaps/blob/8d265aacb905d30bd95dcd54505fb26dc1f9b0b6/contracts/SettToRenIbbtcZap.sol#L162-L183)

    function setZapConfig(
        uint256 _idx,
        address _sett,
        address _token,
        address _curvePool,
        address _withdrawToken,
        int128 _withdrawTokenIndex
    ) external {
        _onlyGovernance();
    
        require(_sett != address(0));
        require(_token != address(0));
        require(
            _withdrawToken == address(WBTC) || _withdrawToken == address(RENBTC)
        );
    
        zapConfigs[_idx].sett = ISett(_sett);
        zapConfigs[_idx].token = IERC20Upgradeable(_token);
        zapConfigs[_idx].curvePool = ICurveFi(_curvePool);
        zapConfigs[_idx].withdrawToken = IERC20Upgradeable(_withdrawToken);
        zapConfigs[_idx].withdrawTokenIndex = _withdrawTokenIndex;
    }

In the current implementation, when `curvePool` or `token` got updated, `token` is not approved to `curvePool`, which will malfunction the contract and break minting.

##### [](#recommendation-1)Recommendation

Change to:

    function setZapConfig(
        uint256 _idx,
        address _sett,
        address _token,
        address _curvePool,
        address _withdrawToken,
        int128 _withdrawTokenIndex
    ) external {
        _onlyGovernance();
    
        require(_sett != address(0));
        require(_token != address(0));
        require(
            _withdrawToken == address(WBTC) || _withdrawToken == address(RENBTC)
        );
    
        if (zapConfigs[_idx].curvePool != _curvePool && _curvePool != address(0)) {
            IERC20Upgradeable(_token).safeApprove(
                _curvePool,
                type(uint256).max
            );
        }
    
        zapConfigs[_idx].sett = ISett(_sett);
        zapConfigs[_idx].token = IERC20Upgradeable(_token);
        zapConfigs[_idx].curvePool = ICurveFi(_curvePool);
        zapConfigs[_idx].withdrawToken = IERC20Upgradeable(_withdrawToken);
        zapConfigs[_idx].withdrawTokenIndex = _withdrawTokenIndex;
    }

**[GalloDaSballo (BadgerDAO) confirmed](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/53#issuecomment-971645325):**

> Agree with the finding, it should be noted that adding a pool does handle for the scenario, this would break the pool in case we update it or change the token

[](#m-03-zap-contracts-redeem-function-doesnt-check-which-token-the-user-wants-to-receive)[\[M-03\] Zap contract’s `redeem()` function doesn’t check which token the user wants to receive](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/2)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by Ruhum_

#### [](#impact)Impact

In the `redeem()` function, the user can pass a token address. That’s the token they receive in return for the ibbtc they give back. Because of missing address checks the user can provide any possible ERC20 token here without the function reverting.

Although it’s not strictly specified in the code I expect that the user should only be able to redeem wBTC or renBTC tokens since they should also only be able to deposit those.

#### [](#proof-of-concept)Proof of Concept

[`Zap.sol` L216-L238](https://github.com/Badger-Finance/ibbtc/blob/d8b95e8d145eb196ba20033267a9ba43a17be02c/contracts/Zap.sol#L216-L238)

#### [](#tools-used)Tools Used

Manual Analysis

#### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Verify that the passed token address is either wBTC or renbtc

**[tabshaikh (BadgerDAO) disagreed with severity](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/2#issuecomment-968351408):**

> best practice to add wBTC or renbtc in require, disagree on the severity

**[GalloDaSballo (BadgerDAO) commented](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/2#issuecomment-971661354):**

> Agree with the finding since only user can rekt themselves I believe this to be a medium severity finding we’ll mitigate by adding a slippage check at the end of the function

[](#m-04-excessive-require-makes-the-transaction-fail-unexpectedly)[\[M-04\] Excessive `require` makes the transaction fail unexpectedly](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/50)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug_

The check for `RENCRV_VAULT.blockLock` is only needed when `if (_amounts[1] > 0 || _amounts[2] > 0)`.

However, in the current implementation, the check is done at the very first, making transactions unrelated to `RENCRV_VAULT` fail unexpectedly if there is a prior transaction involved with `RENCRV_VAULT` in the same block.

[`IbbtcVaultZap.sol` L149-L199](https://github.com/Badger-Finance/badger-ibbtc-utility-zaps/blob/8d265aacb905d30bd95dcd54505fb26dc1f9b0b6/contracts/IbbtcVaultZap.sol#L149-L199)

    function deposit(uint256[4] calldata _amounts, uint256 _minOut)
        public
        whenNotPaused
    {
        // Not block locked by setts
        require(
            RENCRV_VAULT.blockLock(address(this)) < block.number,
            "blockLocked"
        );
        require(
            IBBTC_VAULT.blockLock(address(this)) < block.number,
            "blockLocked"
        );
    
        uint256[4] memory depositAmounts;
    
        for (uint256 i = 0; i < 4; i++) {
            if (_amounts[i] > 0) {
                ASSETS[i].safeTransferFrom(
                    msg.sender,
                    address(this),
                    _amounts[i]
                );
                if (i == 0 || i == 3) {
                    // ibbtc and sbtc
                    depositAmounts[i] += _amounts[i];
                }
            }
        }
    
        if (_amounts[1] > 0 || _amounts[2] > 0) {
            // Use renbtc and wbtc to mint ibbtc
            // NOTE: Can change to external zap if implemented
            depositAmounts[0] += _renZapToIbbtc([_amounts[1], _amounts[2]]);
        }
        // ...
    }

**[shuklaayush (BadgerDAO) confirmed](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/50)**

**[GalloDaSballo (BadgerDAO) commented](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/50#issuecomment-971671020):**

> Agree with the finding, we would have to check for those locks only under specific condition, not doing so opens up to unnecessary reverts

**[GalloDaSballo (BadgerDAO) patched](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/50#issuecomment-971671172):**

> We have mitigated by following the advice of the warden

[](#m-05-no-slippage-control-on-deposit-of-ibbtcvaultzapsol)[\[M-05\] No slippage control on `deposit` of `IbbtcVaultZap.sol`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/71)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gzeon, also found by WatchPug_

#### [](#impact-1)Impact

There is no slippage control on `deposit` of `IbbtcVaultZap.sol`, which expose user to sandwich attack.

#### [](#proof-of-concept-1)Proof of Concept

[`IbbtcVaultZap.sol` L174](https://github.com/Badger-Finance/badger-ibbtc-utility-zaps/blob/6f700995129182fec81b772f97abab9977b46026/contracts/IbbtcVaultZap.sol#L174) Any deposit can be sandwiched, especially when the pool is not balanced.

#### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Add a `minOut` in line with the mint function of other contacts, and pass it as a parameter on L174

[](#m-06-calcmint-always-return-poolid0-and-idx0)[\[M-06\] `calcMint` always return poolId=0 and idx=0](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/72)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by gzeon_

#### [](#impact-2)Impact

`calcMint` in Zap.sol always return poolId=0 and idx=0, while the docstring specified it should return the most optimal route instead. This will lead to suboptimal zap.

#### [](#proof-of-concept-2)Proof of Concept

\-[`Zap.sol` L156](https://github.com/Badger-Finance/ibbtc/blob/d8b95e8d145eb196ba20033267a9ba43a17be02c/contracts/Zap.sol#L156)

**[GalloDaSballo (BadgerDAO) commented](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/72#issuecomment-971678895):**

> Given the context that the warden has, the finding is valid, we’re missing two functions for `calcMint`
> 
> As for us, we have shifted to only using pool 0 as such the code works fine for us

[](#low-risk-findings-7)Low Risk Findings (7)
=============================================

*   [\[L-01\] Wrong comment on `SettToRenIbbtcZap.sol` and `IbbtcVaultZap.sol`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/16) _Submitted by 0x0x0x_
*   [\[L-02\] `Zap.sol#redeem()` Lack of input validation](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/37) _Submitted by WatchPug_
*   [\[L-03\] Arithmetic operations without using SafeMath may over/underflow](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/44) _Submitted by WatchPug_
*   [\[L-04\] Use `safeTransfer`/`safeTransferFrom` consistently instead of `transfer`/`transferFrom`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/8) _Submitted by defsec_
*   [\[L-05\] Zap contract’s `mint()` allows minting ibbtc tokens for free](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/1) _Submitted by Ruhum_
*   [\[L-06\] Missing overflow protection](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/13) _Submitted by pmerkleplant_
*   [\[L-07\] `blockLock` of `RENCRV_SETT` makes transactions likely to fail as only 1 transaction is allowed in 1 block](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/52) _Submitted by WatchPug_

[](#non-critical-findings-7)Non-Critical Findings (7)
=====================================================

*   [\[N-01\] Critical changes should use two-step procedure](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/56) _Submitted by WatchPug, also found by defsec_
*   [\[N-02\] Modifier should be used instead of functions to write modifier in ibBTC VaultZap.sol](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/26) _Submitted by fatima_naz\_
*   [\[N-03\] use modifier keyword to write modifier not function In `SettToRenIbbtcZap.sol` line no - 105 and 109](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/27) _Submitted by fatima_naz\_
*   [\[N-04\] Missing events for critical operations](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/55) _Submitted by WatchPug, also found by pants, 0x0x0x, and defsec_
*   [\[N-05\] Open TODOs](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/67) _Submitted by pants, also found by Meta0xNull, GiveMeTestEther, and ye0lde_
*   [\[N-06\] Redundant type casting](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/42) _Submitted by WatchPug_
*   [\[N-07\] named return issue - Zap.sol `calcMint`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/59) _Submitted by pants_

[](#gas-optimizations-19)Gas Optimizations (19)
===============================================

*   [\[G-01\] For `uint` use `!= 0` instead of `> 0`](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/18) _Submitted by 0x0x0x_
*   [\[G-02\] SLOAD pools.length for Every Loop is Waste of Gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/28) _Submitted by Meta0xNull_
*   [\[G-03\] Avoiding Initialization of Loop Index If It Is 0](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/29) _Submitted by Meta0xNull_
*   [\[G-04\] Zap.sol declares unused variable `_ren` in `calcRedeemInRen` among other functions](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/4) _Submitted by TomFrench_
*   [\[G-05\] Adding `recipient` parameter to mint functions can help avoid unnecessary token transfers and save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/34) _Submitted by WatchPug_
*   [\[G-06\] `Zap.sol#mint()` Validation of `poolId` can be done earlier to save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/35) _Submitted by WatchPug_
*   [\[G-07\] Avoid unnecessary read of array length in for loops can save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/36) _Submitted by WatchPug_
*   [\[G-08\] Unused local variables](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/39) _Submitted by WatchPug, also found by GiveMeTestEther, ye0lde, and pmerkleplant_
*   [\[G-09\] Avoid unnecessary code execution can save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/41) _Submitted by WatchPug_
*   [\[G-10\] Avoid unnecessary arithmetic operations can save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/45) _Submitted by WatchPug_
*   [\[G-11\] `Zap.sol#mint()` Check `blockLock` earlier can save gas](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/49) _Submitted by WatchPug_
*   [\[G-12\] Gas Optimization on the Public Function](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/79) _Submitted by defsec_
*   [\[G-13\] Gas optimization: Use else if for mutually exclusive conditions](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/76) _Submitted by gzeon, also found by WatchPug_
*   [\[G-14\] Gas optimization: Unreachable code in Zap.sol](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/77) _Submitted by gzeon_
*   [\[G-15\] Gas optimization: Unnecessary ops](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/78) _Submitted by gzeon_
*   [\[G-16\] Unnecessary `SLOAD`s / `MLOAD`s / `CALLDATALOAD`s in for-each loops](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/58) _Submitted by pants_
*   [\[G-17\] Zap.sol init for loop - uint default value is 0](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/60) _Submitted by pants_
*   [\[G-18\] public function that could be set external instead](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/61) _Submitted by pants_
*   [\[G-19\] ibbtcCurveLP can be simplified](https://github.com/code-423n4/2021-11-badgerzaps-findings/issues/21) _Submitted by ye0lde_

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }