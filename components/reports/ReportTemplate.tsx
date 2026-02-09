import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#D4740E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4740E',
    letterSpacing: 2,
  },
  companyName: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 10,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 8,
    color: '#999',
  },
  pageNumber: {
    fontSize: 8,
    color: '#999',
  },
});

interface ReportTemplateProps {
  companyName: string;
  companyLogo?: string;
  reportTitle: string;
  reportDate: string;
  children: React.ReactNode;
}

export function ReportTemplate({
  companyName,
  companyLogo,
  reportTitle,
  reportDate,
  children,
}: ReportTemplateProps) {
  const generatedAt = new Date().toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            { }
            {companyLogo ? (
              <Image src={companyLogo} style={styles.logo} />
            ) : (
              <Text style={styles.logoText}>BITACORA</Text>
            )}
            <View>
              <Text style={styles.companyName}>{companyName}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>{reportTitle}</Text>
            <Text style={styles.reportDate}>{reportDate}</Text>
          </View>
        </View>

        <View style={styles.content}>{children}</View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generado por BITACORA — {generatedAt}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
