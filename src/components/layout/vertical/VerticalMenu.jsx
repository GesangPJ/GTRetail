// VerticalMenu. Lokasi : /src/components/layout/vertical/VerticalMenu.jsx

'use client'

import React from 'react'

import { useSession } from 'next-auth/react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  const { data: session } = useSession()
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  if (!session) {
    return null
  }

  const isAdmin = session.user.userType === 'ADMIN'
  const isKaryawan = session.user.userType === 'KARYAWAN'

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        {isAdmin && (
          <>
            <MenuItem
              href='/dashboard'
              icon={<i className="ri-dashboard-line"></i>}
            >
              Dashboard
            </MenuItem>
            <MenuSection Label=''>
              <SubMenu
                label='Penjualan'
                icon={<i className="ri-shopping-cart-line"></i>}
              >
                <MenuItem href='/dashboard/transaksi'>Daftar Transaksi</MenuItem>
                <MenuItem href='/dashboard/pelanggan'>Daftar Pelanggan</MenuItem>
                <MenuItem href='/dashboard/tambah-pelanggan'>Tambah Pelanggan</MenuItem>
              </SubMenu>
            </MenuSection>
            <SubMenu
              label='Inventaris'
              icon={<i className="ri-archive-2-line"></i>}
            >
                <MenuItem href='/dashboard/produk'>Daftar Produk</MenuItem>
                <MenuItem href='/dashboard/tambah-produk'>Tambah Produk</MenuItem>
                <MenuItem href='/dashboard/kategori'>Kategori Produk</MenuItem>
                <MenuItem href='/dashboard/atur-stok'>Atur Stok Produk</MenuItem>
                <MenuItem href='/dashboard/kedatangan'>Kedatangan Pembelian</MenuItem>
            </SubMenu>
            <SubMenu
              label='Pembelian'
              icon={<i className="ri-bank-card-2-line"></i>}
            >
              <MenuItem href='/dashboard/pembelian'>Pembelian Produk</MenuItem>
              <MenuItem href='/dashboard/daftar-pembelian'>Daftar Pembelian</MenuItem>
              <MenuItem href='/dashboard/edit-status-pembelian'>Konfirmasi Pembelian</MenuItem>
              <MenuItem href='/dashboard/distributor'>Daftar Distributor</MenuItem>
              <MenuItem href='/dashboard/tambah-distributor'>Tambah Distributor</MenuItem>

            </SubMenu>
            <SubMenu
              label='Jurnal'
              icon={<i className="ri-safe-fill"></i>}
              >
                <MenuItem href='/dashboard/jurnal-bank'>Jurnal Bank</MenuItem>
                <MenuItem href='/dashboard/jurnal-cash'>Jurnal Cash</MenuItem>

            </SubMenu>
            <SubMenu
              label='Laporan'
              icon={<i className="ri-file-chart-line"></i>}
            >
              <MenuItem href='/dashboard/laporan/transaksi'>Transaksi Bulanan</MenuItem>
              <MenuItem href='/dashboard/laporan/produk'>Produk</MenuItem>
              <MenuItem href='/dashboard/laporan/pembelian'>Pembelian Produk</MenuItem>
              <MenuItem href='/dashboard/laporan/pembelian-bermasalah'>Pembelian Bermasalah</MenuItem>

            </SubMenu>
            <SubMenu
              label='Manajemen Akun'
              icon={<i className='ri-account-circle-fill' />}
            >
              <MenuItem href='/dashboard/daftar-akun'>Tabel Akun</MenuItem>
              <MenuItem href='/dashboard/registrasi-akun'>Registrasi Akun</MenuItem>
              <MenuItem href='/dashboard/reset-password-akun'>Reset Password Akun</MenuItem>
            </SubMenu>
            <SubMenu
              label='Pengaturan'
              icon={<i className="ri-settings-5-line"></i>}
            >
              <MenuItem href='/dashboard/pengaturan'>Pengaturan Toko</MenuItem>
            </SubMenu>
            <SubMenu
              label='Bantuan'
              icon={<i className="ri-question-line"></i>}
            >
              <MenuItem href='/dashboard/bantuan'>Penggunaan</MenuItem>
              <MenuItem href='/dashboard/dokumentasi-api'>Dokumentasi API</MenuItem>
            </SubMenu>
          </>
        )}

        {isKaryawan && (
          <>
            <MenuItem
              href='/dashboard'
              icon={<i className="ri-dashboard-line"></i>}
            >
              Dashboard
            </MenuItem>
            <SubMenu
                label='Penjualan'
                icon={<i className="ri-shopping-cart-line"></i>}
              >
                <MenuItem href='/dashboard/transaksi'>Daftar Transaksi</MenuItem>
                <MenuItem href='/dashboard/pelanggan'>Daftar Pelanggan</MenuItem>
                <MenuItem href='/dashboard/tambah-pelanggan'>Tambah Pelanggan</MenuItem>
              </SubMenu>
            <MenuSection Label=''>
              <SubMenu
                label='Inventaris'
                icon={<i className="ri-archive-2-line"></i>}
              >
                <MenuItem href='/dashboard/produk'>Daftar Produk</MenuItem>
                <MenuItem href='/dashboard/tambah-produk'>Tambah Produk</MenuItem>
                <MenuItem href='/dashboard/kategori'>Kategori Produk</MenuItem>
                <MenuItem href='/dashboard/atur-stok'>Atur Stok Produk</MenuItem>
                <MenuItem href='/dashboard/kedatangan'>Kedatangan Pembelian</MenuItem>
              </SubMenu>

            <SubMenu
              label='Pembelian'
              icon={<i className="ri-bank-card-2-line"></i>}
            >
              <MenuItem href='/dashboard/pembelian-k'>Pembelian Produk</MenuItem>
              <MenuItem href='/dashboard/daftar-pembelian'>Daftar Pembelian</MenuItem>
              <MenuItem href='/dashboard/distributor'>Daftar Distributor</MenuItem>

            </SubMenu>
              <SubMenu
              label='Bantuan'
              icon={<i className="ri-question-line"></i>}
            >
              <MenuItem href='/dashboard/bantuan'>Penggunaan</MenuItem>
            </SubMenu>
            </MenuSection>
          </>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
