  it("Replay withdraw signature across vaults", async () => {
    await program.methods.vaultAddCurrency(
      mintB,
      50
    )
      .accountsStrict({
        ...accounts,
        admin: authority,
        payer: authority,
        vault: vaultB,
        mint: mintB
      })
      .signers([authorityKeypair])
      .rpc()
      .then(confirm)
      .then(log)

    await program.methods.vaultSetNav(
      ONE_BITCOIN.add(new BN(1))
    )
      .accountsStrict({
        oracleManager: authority,
        vault: vaultB
      })
      .signers([authorityKeypair])
      .rpc()
      .then(confirm)
      .then(log)

    await program.methods.vaultWithdrawRequest(
      Array.from(hash),
      new BN(500_000)
    )
      .accountsStrict({
        ...accounts,
        vault: vaultB,
        withdrawRequest: withdrawRequestB,
        userTargetTa: userAtaB,
        mintTarget: mintB,
        userWithdrawTa: userAtaB,
        mintWithdraw: mintB
      })
      .signers([userKeypair])
      .rpc()
      .then(confirm)
      .then(log)

    let tx = new Transaction();
    tx.instructions = [
      createAssociatedTokenAccountIdempotentInstruction(
        provider.publicKey,
        vaultBAtaB,
        vaultB,
        mintB
      ),
      createTransferCheckedInstruction(
        authorityAtaB,
        mintB,
        vaultBAtaB,
        authority,
        600_000,
        8
      )
    ]
    await provider.sendAndConfirm(tx, [authorityKeypair]).then(log);

    const withdrawRequestData = await program.account.withdrawRequest.fetch(withdrawRequest);
    const verifierHash = deriveWithdrawRequestEip191(
      user,
      mintB,
      hash,
      withdrawRequestData.shares,
      withdrawRequestData.nav,
    )
    const signature = createEip191WithdrawSig(
      verifierKeypair,
      verifierHash
    )
    const ix = await program.methods.vaultWithdraw(
      Array.from(hash),
      signature.signature
    )
      .accountsStrict({
        ...accounts,
        vault: vaultB,
        withdrawRequest: withdrawRequestB,
        userWithdrawTa: userAtaB,
        mintWithdraw: mintB,
        vaultWithdrawTa: vaultBAtaB,
        feeReceiverTa: authorityAtaB
      }).instruction();

    tx = new Transaction();
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }));
    tx.add(ix);
    await sendAndConfirmTransaction(connection, tx, [userKeypair]);
  })