-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
